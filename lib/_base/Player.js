const UUIDjs = require('uuid-js');

const EffectJS = require('./Effect.js');
const Resource = require('./Resource.js').Resource;

const UtilsJS = require('./utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

export class Player {
  constructor({name="PlayerName", resources=[], effects=[]} = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.name = name;

    /* Copy effects, because we will mutate them (start time) */
    this.effects = effects.map(MutableObject.mutableCopy);
    this.resources = resources;
  }
  updateTime(deltaSeconds) {
    this.time += deltaSeconds;
    return [];
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
    this.resources = Resource.aggregateSameTypeResources(this.resources);
  }
  canAfford(costs) {
    var player = this;
    var canAfford = true;
    Resource.aggregateSameTypeResources(costs).forEach(function(cost) {
      var r = player.getResourceAmountForType(cost.type);
      if (r < cost.amount) {
        canAfford = false;
      }
    });
    return canAfford;
  }
  spendResource(spend) {
    if (spend.amount > 0) {
      this.resources.forEach(function(resource) {
        if (resource.amount < spend.amount) {
          throw new InsuficientResourcesError();
        }
        resource.amount -= spend.amount;
      });
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
}
