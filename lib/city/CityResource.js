const UUIDjs = require('uuid-js');

export class ResourceError extends Error {
}
export class InsuficientResourcesError extends ResourceError {
}
export class UnavailableActionError extends ResourceError {
}

export class CityResource {
  constructor(type, amount) {
    this.id = UUIDjs.create().toString();
    this.type = type;
    this.amount = amount;
  }
  toString() {
    return this.type + " x " + this.amount.toFixed(1);
  }
  resourceWithMultiplier(resources) {
    let m = this.amount * resources;
    return new this.constructor(this.type, m);
  }
  static resourcesWithMultiplier(resources, multiplier) {
    var mResources = [];
    resources.forEach(function(resource) {
      mResources.push(resource.resourceWithMultiplier(multiplier));
    })
    return CityResource.aggregateSameTypeResources(mResources);
  }
  static aggregateSameTypeResources(array) {
    var _constructor = null;
    var aggregatedResources = {};
    array.forEach(function(cost) {
      if (!aggregatedResources[cost.type]) {
        _constructor = cost.constructor;
        aggregatedResources[cost.type] = 0;
      }
      aggregatedResources[cost.type] += cost.amount;
    });
    let aggregatedArray = [];
    for (let type in aggregatedResources) {
      aggregatedArray.push(new _constructor(type, aggregatedResources[type]));
    }
    return aggregatedArray;
  }
  static resourcesCoverCosts(resources, costs) {
    let remainder = Resource.aggregateSameTypeResources(
      resources.concat(Resource.resourcesWithMultiplier(costs, -1)));
      let missing = 0;
      remainder.forEach(function(res) {
        if (res.amount < 0) {
          missing -= res.amount;
        }
      });
      if (missing > 0) {
        let total = 0;
        costs.forEach(function(cost) {
          total += cost.amount;
        });
        return 1.0 - missing / (1.0 * total);
      }
      return 1.0;
    }
    
    static types() {
      return [
        CityResource.kResourceGold,
        CityResource.kResourceFood,
        CityResource.kResourceWood,
      ];
    }
    
    static gold(amount) {
      return new CityResource(CityResource.kResourceGold, amount);
    }
    static wood(amount) {
      return new CityResource(CityResource.kResourceWood, amount);
    }
    static food(amount) {
      return new CityResource(CityResource.kResourceFood, amount);
    }
  }
  
  CityResource.kResourceGold = 'gold';
  CityResource.kResourceFood = 'food';
  CityResource.kResourceWood = 'wood';
  
  
  export class ResourceConsumingAction {
    constructor(displayNameFunction, availabilityFunction, costCalculationFunction, actionFunction) {
      this.id = UUIDjs.create().toString();
      this.displayNameFunction = displayNameFunction;
      this.availabilityFunction = availabilityFunction;
      this.costCalculationFunction = costCalculationFunction;
      this.actionFunction = actionFunction;
    }
    code() {
      return "unnamed_action";
    }
    displayName() {
      return this.displayNameFunction();
    }
    isAvailable(player) {
      return this.availabilityFunction(player);
    }
    isAffordable(player) {
      if (player) {
        var costs = CityResource.aggregateSameTypeResources(this.costs());
        return player.canAfford(costs);
      }
      return false;
    }
    costs() {
      return this.costCalculationFunction();
    }
    executeForPlayer(player) {
      if (!this.isAvailable(player)) {
        throw new UnavailableActionError();
      }
      if (!this.isAffordable(player)) {
        throw new InsuficientResourcesError();
      }
      var costs = CityResource.aggregateSameTypeResources(this.costs());
      costs.forEach(function(cost) {
        player.spendResource(cost);
      });
      this.actionFunction(player);
      if (player.resourceConsumingActionExecuted) {
        player.resourceConsumingActionExecuted(this, costs);
      }
    }
  }