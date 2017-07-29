import UUIDjs from 'uuid-js';

export class ResourceError {}

export class InsuficientResourcesError extends ResourceError {
  constructor() {
    super();
  }
}

export class UnavailableActionError extends ResourceError {
  constructor() {
    super();
  }
}

export class CityResource {
  constructor(type, amount) {
    this.id = UUIDjs
      .create()
      .toString();
    this.type = type;
    this.amount = amount;
  }
  toString() {
    return this.type+ ': ' + Math.ceil(this.amount);
  }
  resourceWithMultiplier(resources) {
    let m = this.amount * resources;
    return new this.constructor(this.type, m);
  }
  static resourcesWithMultiplier(resources, multiplier) {
    var mResources = [];
    resources.forEach(function (resource) {
      mResources.push(resource.resourceWithMultiplier(multiplier));
    })
    return CityResource.aggregateSameTypeResources(mResources);
  }
  static aggregateSameTypeResources(array) {
    var _constructor = null;
    var aggregatedResources = {};
    array.forEach(function (cost) {
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
    let remainder = CityResource.aggregateSameTypeResources(resources.concat(CityResource.resourcesWithMultiplier(costs, -1)));
    let missing = 0;
    remainder.forEach(function (res) {
      if (res.amount < 0) {
        missing -= res.amount;
      }
    });
    if (missing > 0) {
      let total = 0;
      costs.forEach(function (cost) {
        total += cost.amount;
      });
      return 1.0 - missing / (1.0 * total);
    }
    return 1.0;
  }
}

export class ResourceConsumingAction {
  constructor(displayNameFunction, availabilityFunction, costCalculationFunction, actionFunction) {
    this.id = UUIDjs
      .create()
      .toString();
    this.displayNameFunction = displayNameFunction;
    this.availabilityFunction = availabilityFunction;
    this.costCalculationFunction = costCalculationFunction;
    this.actionFunction = actionFunction;
  }
  displayName() {
    return this.displayNameFunction();
  }
  isAvailable(player) {
    return this.availabilityFunction(player);
  }
  isAffordable(player) {
    var costs = CityResource.aggregateSameTypeResources(this.costs(player));
    return player.canAfford(costs);
  }
  costs(player) {
    if (!player) {
      throw new Error("Cost can only be calculated for a specific player");
    }
    return this.costCalculationFunction(player);
  }
  executeForPlayer(player) {
    if (!this.isAvailable(player)) {
      throw new UnavailableActionError();
    }
    if (!this.isAffordable(player)) {
      throw new InsuficientResourcesError();
    }
    player.spendResources(this.costs(player));
    this.actionFunction(player);
  }
}