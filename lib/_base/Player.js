var UUIDjs = require('uuid-js');

var EffectJS = require('./Effect.js');
var EnableResourceEffect = EffectJS.EnableResourceEffect;
var Resource = require('./Resource.js').Resource;

var UtilsJS = require('./utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

var ResourceStore = require('../../stores/ResourceStore.js').default;
var ResourceActions = require('../../actions/ResourceActions.js');

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
  canEarnResources(resources) {
    return resources.filter((resource) => {
      return EnableResourceEffect.enabledAmount(resource.type, this.effects) > this.getResourceAmountForType(resource.type);
    }).length > 0;
  }
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

    this.resources.forEach(function(resource) {
      let amount = EnableResourceEffect.enabledAmount(resource.type, player.effects);
      if (resource.amount > amount) {
        resource.amount = amount;
      }
    });
    // Update Resource Store
    ResourceActions.addResourceByName(resource.type, resource.amount)
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
        // Update Resource Store
        ResourceActions.removeResource(resource.type, spend.amount);
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
