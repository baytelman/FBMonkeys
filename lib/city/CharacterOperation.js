var UUIDjs = require('uuid-js');

var UtilsJS = require('../_base/utils/Utils.js');
var Event = require('../_base/Event.js').Event;
var MutableObject = UtilsJS.MutableObject;

var CityResource = require('../city/CityResource.js').CityResource;
var BuildingJS = require('./Building.js');
var Building = BuildingJS.Building;

export class CharacterOperation {
  constructor({ time = 1, enabled = true } = {}) {
    this.id = UUIDjs.create().toString();

    this.requiredTime = time;
    this.time = 0;
    this.completed = false;
    this.enabled = enabled;
  }
  toString() {
    return this.constructor.name + " (" + this.id + ") [" + this.time + "/" + this.requiredTime + "]";
  }
  remainingTime() {
    MutableObject.checkIsMutable(this);
    return Math.max(this.requiredTime - this.time, 0);
  }
  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    if (!this.completed) {
      this.time += deltaSeconds;
      this.time = Math.round(this.time*100)/100;
      if (this.requiredTime <= this.time) {
        this.completed = true;
      }
    }
    return [];
  }
  isAvailableForPlayer(player) {
    return this.enabled;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
}

CharacterOperation.kCharacterOperationBeganEvent = 'CharacterOperationBegan';
CharacterOperation.kCharacterOperationCompletedEvent = 'CharacterOperationCompleted';
CharacterOperation.kCharacterOperationProgressEvent = 'CharacterOperationProgress';

export class EarnResourceForPlayerOperation extends CharacterOperation {
  constructor({ resources = [] } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  updateTime(deltaSeconds, parents) {
    let wasCompleted = this.completed;
    let updates = super.updateTime(deltaSeconds, parents);
    if (!wasCompleted && this.completed) {
      this.resources.forEach(function(resource) {
        updates.push(new Event({
          type:CityResource.kEarnResourceEvent,
          object:resource
        }));
      });
      parents.player.earnResources(this.resources);
    }
    return updates;
  }
}

export class CompleteBuildingOperation extends CharacterOperation {
  constructor({ amount = 1 } = {}) {
    super(arguments[0]);
    this.amount = amount;
    this.building = null;
  }
  updateTime(deltaSeconds, parents) {
    let wasCompleted = this.completed;
    let updates = super.updateTime(deltaSeconds, parents);
    if (!wasCompleted && this.completed) {
      let resource = CityResource.construction(this.amount);
      updates.push(new Event({
        type:CityResource.kConsumedResourceEvent,
        object:resource
      }));

      if (this.building.complete([resource])) {
        updates.push(new Event({
          type:Building.kBuildingCompletedEvent,
          object:this.building
        }));
      } else {
        updates.push(new Event({
          type:Building.kBuildingProgressEvent,
          object:this.building
        }));
      }
    }
    return updates;
  }
  isAvailableForPlayer(player) {
    this.building = player.highestPriorityPendingProjectInNeedOf(CityResource.kResourceConstruction);
    return (this.building &&
      this.building.canCompleteResource(CityResource.kResourceConstruction) &&
      super.isAvailableForPlayer(player));
    }
  }

  export class InvestResourceInBuildingOperation extends CharacterOperation {
    constructor({ amount = 1 } = {}) {
      super(arguments[0]);
      this.amount = amount;
      this.building = null;
    }
    updateTime(deltaSeconds, parents) {
      let wasCompleted = this.completed;
      let updates = super.updateTime(deltaSeconds, parents);
      if (!wasCompleted && this.completed) {
        let type = this.building.canCompleteWithAnyOfResources(parents.player.resources);
        let amount = parents.player.getResourceAmountForType(type);
        let resource = new CityResource(type, Math.min(this.amount, amount));
        updates.push(new Event({
          type:CityResource.kSpendResourceEvent,
          object:resource
        }));

        parents.player.spendResource(resource);
        if (this.building.complete([resource])) {
          updates.push(new Event({
            type:CityResource.kBuildingCompletedEvent,
            object:this.building
          }));
        } else {
          updates.push(new Event({
            type:CityResource.kBuildingProgressEvent,
            object:this.building
          }));
        }
      }
      return updates;
    }
    isAvailableForPlayer(player) {
      this.building = player.highestPriorityPendingProjectWeHaveResourcesFor();
      return (this.building && super.isAvailableForPlayer(player));
    }
  }

  export class CityCharacter {
    constructor({ name = "Character", operations = [] } = {}) {
      this.id = UUIDjs.create().toString();

      this.name = name;
      this.operations = operations;
      this.currentOperation = null;
    }

    updateTime(deltaSeconds, parents) {
      parents = Object.assign({ character: this }, parents);
      let updates = [];
      while (true) {
        if (this.currentOperation === null) {
          let futureOperation = this.highestPriorityAvailableOperation(parents);
          if (futureOperation) {
            this.currentOperation = MutableObject.mutableCopy(futureOperation);
            updates.push(new Event({
              type:CharacterOperation.kCharacterOperationBeganEvent,
              object:this.currentOperation
            }));
          }
        }
        if (deltaSeconds <= 0) {
          break;
        }
        let delta = deltaSeconds;
        if (this.currentOperation) {
          delta = Math.min(delta, this.currentOperation.remainingTime());
          let currentResults = this.currentOperation.updateTime(delta, parents);
          if (this.currentOperation.completed) {
            updates.push(new Event({
              type:CharacterOperation.kCharacterOperationCompletedEvent,
              object:this.currentOperation
            }));
            this.currentOperation = null;
          } else {
            updates.push(new Event({
              type:CharacterOperation.kCharacterOperationProgressEvent,
              object:this.currentOperation
            }));
          }
          updates = updates.concat(currentResults);
        }
        deltaSeconds -= delta;
      }
      return updates;
    }
    setOperationPriority(operation, priority) {
      operation.priority = priority;
      this.operations.slice().sort((a, b) => {
        return b.priority - a.priority;
      }).filter((o) => {
        return o != operation && o.priority >= priority;
      }).forEach((o, index) => {
        o.priority = priority + 1 + index;
      });
    }
    prioritizedAvailableOperations(parents) {
      return this.operations.slice().sort((a, b) => {
        return a.priority - b.priority;
      }).filter((o) => {
        return o.isAvailableForPlayer(parents.player);
      });
    }
    highestPriorityAvailableOperation(parents) {
      let operations = this.prioritizedAvailableOperations(parents);
      return operations.length > 0 && operations[0];
    }
  }
