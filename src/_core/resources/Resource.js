
class ResourceError extends Error {
}
class InsuficientResourcesError extends ResourceError {
}
class UnavailableActionError extends ResourceError {
}

const kResourceGold = 'gold';
const kResourceHuman = 'human';
const kResourceWood = 'wood';
const kResourceAnimal = 'animal';
const kResourceJewel = 'jewel';

const kResourceTypes = [
    kResourceHuman,
    kResourceWood,
    kResourceAnimal,
    kResourceGold,
    kResourceJewel,
];

class Resource {
    constructor(type, amount, max) {
        this.type = type;
        this.amount = amount;
        this.max = max;
    }
    toString() {
        return this.type + " x " + this.amount.toFixed(1);
    }
    resourceWithMultiplier(resources) {
        let m = this.amount * resources;
        if (this.max && m > this.max) {
            m = this.max * 1;
        }
        return new Resource(this.type, m);
    }
    static resourcesWithMultiplier(resources, multiplier) {
        var mResources = [];
        resources.forEach(function(resource) {
            mResources.push(resource.resourceWithMultiplier(multiplier));
        })
        return Resource.aggregateSameTypeResources(mResources);
    }
    static aggregateSameTypeResources(array) {
        var aggregatedResources = {};
        array.forEach(function(cost) {
            if (!aggregatedResources[cost.type]) {
                aggregatedResources[cost.type] = 0;
            }
            aggregatedResources[cost.type] += cost.amount;
        });
        let aggregatedArray = [];
        for (let type in aggregatedResources) {
            aggregatedArray.push(new Resource(type, aggregatedResources[type]));
        }
        return aggregatedArray;
    }
    static playerCanAfford(player, costs) {
        var canAfford = true;
        Resource.aggregateSameTypeResources(costs).forEach(function(cost) {
            var r = player.getResourceAmountForType(cost.type);
            if (r < cost.amount) {
                canAfford = false;
            }
        });
        return canAfford;
    }
    static gold(amount) {
        return new Resource(kResourceGold, amount);
    }
    static human(amount) {
        return new Resource(kResourceHuman, amount);
    }
    static wood(amount) {
        return new Resource(kResourceWood, amount);
    }
    static jewel(amount) {
        return new Resource(kResourceJewel, amount);
    }
}

class ResourceConsumingAction {
    constructor(displayNameFunction, availabilityFunction, costCalculationFunction, actionFunction) {
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
    isAvailable() {
        return this.availabilityFunction();
    }
    isAffordable(player) {
        if (player) {
            var costs = Resource.aggregateSameTypeResources(this.costs());
            return Resource.playerCanAfford(player, costs);
        }
        return false;
    }
    costs() {
        return this.costCalculationFunction();
    }
    executeForPlayer(player) {
        if (!this.isAvailable()) {
            throw new UnavailableActionError();
        }
        if (!this.isAffordable(player)) {
            throw new InsuficientResourcesError();
        }
        var costs = Resource.aggregateSameTypeResources(this.costs());
        costs.forEach(function(cost) {
            player.spendResource(cost);
        });
        this.actionFunction();
        if (player.resourceConsumingActionExecuted) {
            player.resourceConsumingActionExecuted(this, costs);
        }
    }
}


class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({ city, building, location }) {
    super(
      "Build",
      function() { return true; },
      function() { return building.costs; },
      function() {
        city.addBuilding({
            building: building,
            location: location
        });
      });
    }
}

