import UUIDjs from 'uuid-js';

import MutableObject from './utils/Utils';

import City from './City';
import CityEvent from './CityEvent';
import {FrequencyEffect} from './Effect';
import {CityResource, InsuficientResourcesError} from './CityResource';

export default class CityPlayer {
  constructor({name="PlayerName", resources=[], initialCapacity={}, city = new City()} = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.name = name;
    this.resources = {};
    this.initialCapacity = initialCapacity;
    this.city = city;
    this.earnResources(resources);
  }
  
  updateTime(deltaSeconds) {
    this.time += deltaSeconds;
    let parents = {
      player: this
    };
    
    let updated = [];
    while(deltaSeconds > 0) {
      let d = Math.min(deltaSeconds, CityPlayer.timeGranularity);
      updated = updated.concat(this.city.updateTime(d, parents));
      deltaSeconds -= d;
    }
    return updated;
  }
  /* Resources */
  earnResources(resources) {
    let player = this;
    resources.forEach(function(resource) {
      if (!player.resources[resource.type]) {
        player.resources[resource.type] = new CityResource(resource.type, 0);
      }
      let max = player.initialCapacity[resource.type] || 0;
      player.resources[resource.type].amount = Math.min(max, resource.amount + (player.resources[resource.type].amount || 0));
    });
  }
  canAfford(costs) {
    var canAfford = true;
    CityResource.aggregateSameTypeResources(costs).forEach((cost) => {
      var r = this.getResourceAmountForType(cost.type);
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
      if (this.getResourceAmountForType(c.type) < c.amount) {
        canAfford = false;
      }
    });
    if (!canAfford) {
      throw new InsuficientResourcesError();
    }
    costs.forEach((c) => {
      this.resources[c.type] -= c.amount;
    });
  }
  getResourceAmountForType(type) {
    return (this.resources[type] && this.resources[type].amount) || 0;
  }
  fulfillsRequirements(requirements) {
    let conditions = Object.values(this.city.buildings).map(b => b.isCompleted() && b.namespace);
    return requirements.every(req => conditions.indexOf(req) > -1);
  }
}

CityPlayer.timeGranularity = 0.25;

export class PlayerEarnResourceEffect extends FrequencyEffect {
  constructor({resources=[], frequency=1} = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  trigger(parents) {
    let event = new CityEvent({
      type:CityEvent.kEarnResourceEvent,
      object:this,
      data:this.resources
    });
    parents.player.earnResources(this.resources);
    return [event];
  }
  toString() {
    return super.toString() + " [" + this.resources + " " + (this.time - this.cycleStart) + "/" + this.frequency + " @ " + this.time + "]";
  }
}
