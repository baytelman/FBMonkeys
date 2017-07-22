import UUIDjs from 'uuid-js';

import MutableObject from './utils/Utils';

import City from './City';
import CityEvent from './CityEvent';
import {FrequencyEffect} from './Effect';
import {CityResource, InsuficientResourcesError} from './CityResource';

export default class CityPlayer {
  constructor({name="PlayerName", resources=[], city = new City()} = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.name = name;
    this.resources = resources;
    this.city = city;
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
    resources.forEach(function(r) {
      player.earnResource(r);
    });
  }
  earnResource(resource) {
    let player = this;
    this.resources.push(resource);
    this.resources = CityResource.aggregateSameTypeResources(this.resources);
  }
  canAfford(costs) {
    var player = this;
    var canAfford = true;
    CityResource.aggregateSameTypeResources(costs).forEach(function(cost) {
      var r = player.getResourceAmountForType(cost.type);
      if (r < cost.amount) {
        canAfford = false;
      }
    });
    return canAfford;
  }
  spendResource(spend) {
    if (spend.amount > 0) {
      let covered = false;
      this.resources.forEach(function(resource) {
        if (resource.type === spend.type) {
          if (resource.amount < spend.amount) {
            throw new InsuficientResourcesError();
          }
          resource.amount -= spend.amount;
          spend.amount = 0;
          covered = true;
        }
      });
      if (!covered) {
          throw new InsuficientResourcesError();
      }
    }
  }
  getResourceAmountForType(type) {
    for (let index in this.resources) {
      if ((this.resources[index]).type === type) {
        return (this.resources[index]).amount;
      }
    }
    return 0;
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
