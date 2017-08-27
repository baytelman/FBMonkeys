import UUIDjs from 'uuid-js';

export class ResourceError extends Error {}

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
  constructor(namespace, amount) {
    this.id = UUIDjs
      .create()
      .toString();
    this.namespace = namespace;
    this.amount = amount;
  }
  toString() {
    return this.namespace + ' x ' + Math.ceil(this.amount);
  }
  resourceWithMultiplier(factor) {
    let m = this.amount * factor;
    return new this.constructor(this.namespace, m);
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
      if (!aggregatedResources[cost.namespace]) {
        _constructor = cost.constructor;
        aggregatedResources[cost.namespace] = 0;
      }
      aggregatedResources[cost.namespace] += cost.amount;
    });
    let aggregatedArray = [];
    for (let namespace in aggregatedResources) {
      aggregatedArray.push(new _constructor(namespace, aggregatedResources[namespace]));
    }
    return aggregatedArray;
  }
  static resourcesCoverCosts(resources, cost) {
    let remainder = CityResource.aggregateSameTypeResources(resources.concat(CityResource.resourcesWithMultiplier(cost, -1)));
    let missing = 0;
    remainder.forEach(function (res) {
      if (res.amount < 0) {
        missing -= res.amount;
      }
    });
    if (missing > 0) {
      let total = 0;
      cost.forEach(function (cost) {
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
    var cost = CityResource.aggregateSameTypeResources(this.cost(player));
    return player.canAfford(cost);
  }
  cost(player) {
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
    player.spendResources(this.cost(player));
    this.actionFunction(player);
  }
}

export class ResourceEffect {
  constructor({
    additions = 0,
    multipliers = 0
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
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
    return combinedUnits;
  }
  toString() {
    return "ResourceEffect";
  }
}
