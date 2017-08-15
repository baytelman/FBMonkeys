import values from 'object.values';
import entries from 'object.entries';
if (!Object.values) {
    values.shim();
    entries.shim();
}

import UUIDjs from 'uuid-js';

import MutableObject from './utils/Utils';

import City from './City';
import CityEvent from './CityEvent';
import {FrequencyEffect} from './Effect';
import {CityResource, InsuficientResourcesError} from './CityResource';

export class CityPlayer {
  constructor({
    name = "PlayerName",
    resources = [],
    initialCapacity = {},
    characterFactories = {},
    city = new City()
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.time = 0;
    this.name = name;
    this.resources = {};
    this.initialCapacity = initialCapacity;
    this.characterFactories = characterFactories;
    this.city = city;
    this.earnResources(resources);
    this.fulfilledRequirements = {};
  }

  updateTime(deltaSeconds) {
    this.time += deltaSeconds;
    let parents = {
      player: this
    };

    let updated = [];
    while (deltaSeconds > 0) {
      let d = Math.min(deltaSeconds, CityPlayer.timeGranularity);
      updated = updated.concat(this.city.updateTime(d, parents));
      deltaSeconds -= d;
    }
    return updated;
  }
  /* Resources */
  canEarnAnyResources(resources) {
    let capacity = this.getCapacity();
    const canEarn = resources.map(r => capacity[r.namespace] && capacity[r.namespace] > ((this.resources[r.namespace] && this.resources[r.namespace].amount) || 0)).some(can => can);
    return canEarn;
  }
  earnResources(resources) {
    let player = this;
    let capacity = player.getCapacity();

    resources.forEach(function (resource) {
      if (!player.resources[resource.namespace]) {
        player.resources[resource.namespace] = new CityResource(resource.namespace, 0);
      }
      let max = capacity[resource.namespace] || 0;
      player.resources[resource.namespace].amount = Math.min(max, resource.amount + (player.resources[resource.namespace].amount || 0));
    });
  }
  canAfford(costs) {
    var canAfford = true;
    CityResource
      .aggregateSameTypeResources(costs)
      .forEach((cost) => {
        var r = this.getResourceAmountForType(cost.namespace);
        if (r < cost.amount) {
          canAfford = false;
        }
      });
    return canAfford;
  }
  spendResources(costs) {
    let canAfford = true;
    costs = CityResource.aggregateSameTypeResources(costs);
    costs.forEach((c) => {
      if (this.getResourceAmountForType(c.namespace) < c.amount) {
        canAfford = false;
      }
    });
    if (!canAfford) {
      throw new InsuficientResourcesError();
    }
    costs.forEach((c) => {
      this.resources[c.namespace].amount -= c.amount;
    });
  }
  getResourceAmountForType(namespace) {
    return (this.resources[namespace] && this.resources[namespace].amount) || 0;
  }

  getCapacity() {
    let capacity = {
      additions: Object.assign({}, this.initialCapacity),
      totals: Object.assign({}, this.initialCapacity)
    };

    Object
      .values(this.city.buildings)
      .filter(b => b.isCompleted())
      .forEach(b => {
        let effects = b
          .permanentEffects
          .filter(effect => effect instanceof CapacityGrantingEffect);
        effects.forEach(effect => effect.combine(capacity));
      });
    return capacity.totals;
  }

  getAchievements({
    completedOnly = true
  } = {}) {
    let achievements = {};
    Object
      .values(this.city.buildings)
      .forEach(b => {
        if (b.namespace && (!completedOnly || b.isCompleted())) {
          achievements[b.namespace] = 1 + (achievements[b.namespace] || 0);
        }
      });
    return achievements;
  }

  fulfillsRequirements(namespace, requirements) {
    if (this.fulfilledRequirements[namespace]) {
      return true;
    }
    let achievements = this.getAchievements();
    let fullfills = (multipleRequirement => {
      let namespace = multipleRequirement[0];
      let amount = multipleRequirement[1];
      return (achievements[namespace] || 0) >= amount;
    });
    if (requirements.every(req => req instanceof Array? fullfills(req) : fullfills([req, 1]))) {
      this.fulfilledRequirements[namespace] = true;
      return true;
    }
    return false;
  }
}

CityPlayer.timeGranularity = 0.25;

export class PlayerEarnResourceEffect extends FrequencyEffect {
  constructor({
    resources = [],
    frequency = 1
  } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  canBegin(parents) {
    return parents
      .player
      .canEarnAnyResources(this.resources);
  }
  trigger(parents) {
    let event = new CityEvent({type: CityEvent.kEarnResourceEvent, object: this, data: this.resources});
    parents
      .player
      .earnResources(this.resources);
    return [event];
  }
  getDescription() {
    return "Gives " + this
      .resources
      .map(r => r.toString())
      .join(" + ") + " every " + this.frequency + " sec";
  }
}

export class ResourceEffect {
  constructor({
    additions = 0,
    multipliers = 0
  } = {}) {
    this.additions = additions;
    this.multipliers = multipliers;
  }
  _combine(combined, local) {
    Object
      .entries(local)
      .forEach(([key, value]) => {
        combined[key] = (combined[key] || 0) + value;
      });
    return combined;
  }
  combine(combinedUnits) {
    combinedUnits.additions = this._combine(combinedUnits.additions || {}, this.additions);
    combinedUnits.multipliers = this._combine(combinedUnits.multipliers || {}, this.multipliers);
    combinedUnits.totals = Object.assign({}, combinedUnits.additions);
    Object
      .entries(combinedUnits.multipliers)
      .forEach(([key, value]) => {
        if (combinedUnits.additions[key]) {
          combinedUnits.totals[key] *= Math.max(0, 1 + value);
        }
      });
    return combinedUnits;
  }
}

export class CapacityGrantingEffect extends ResourceEffect {}