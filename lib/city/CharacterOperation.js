var UtilsJS = require('../_base/utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

export class CharacterOperation {
  constructor({ time = 1 } = {}) {
    this.requiredTime = time;
    this.time = 0;
    this.completed = false;
  }
  remainingTime() {
    MutableObject.checkIsMutable(this);
    return Math.max(this.requiredTime - this.time, 0);
  }
  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    let updates = [];
    if (!this.completed) {
      this.time += deltaSeconds;
      if (this.requiredTime <= this.time) {
        this.completed = true;
      }
    }
    return updates;
  }
  isAvailableForPlayer(player) {
    return true;
  }
}

export class EarnResourceForPlayerOperation extends CharacterOperation {
  constructor({ resources = [] } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  updateTime(deltaSeconds, parents) {
    let wasCompleted = this.completed;
    let updates = super.updateTime(deltaSeconds, parents);
    if (!wasCompleted && this.completed) {
      updates = updates.concat(this.resources);
      parents.player.earnResources(this.resources);
    }
    return updates;
  }
  isAvailableForPlayer(player) {
    return player.canEarnResources(this.resources) && super.isAvailableForPlayer(player);
  }
}

export class CompleteBuildingOperation extends CharacterOperation {
  constructor({ amount = [] } = {}) {
    super(arguments[0]);
    this.amount = amount;
    this.project = null;
  }
  updateTime(deltaSeconds, parents) {
    if (!this.project) {
      this.project = parents.player.highestPriorityPendingProjectInNeedOf(Building, CityResource.kResourceConstruction);
    }
    let wasCompleted = this.completed;
    let updates = super.updateTime(deltaSeconds, parents);
    if (!wasCompleted && this.completed) {
      let resource = CityResource.construction(this.amount);
      updates = updates.push(resource);
      if (this.project.complete([resource])) {
        updates = updates.push(this.project);
      }
      parents.player.earnResources(this.resources);
    }
    return updates;
  }
  isAvailableForPlayer(player) {
    return player.canEarnResources(this.resources) && super.isAvailableForPlayer(player);
  }
}

export class CityCharacter {
  constructor({ name = "Character", operations = [] } = {}) {
    this.name = name;
    this.operations = operations;
    this.currentOperation = null;
  }

  updateTime(deltaSeconds, parents) {
    parents = Object.assign({ character: this }, parents);
    let updated = [];
    while (true) {
      if (this.currentOperation === null) {
        let futureOperation = this.highestPriorityAvailableOperation(parents);
        if (futureOperation) {
          this.currentOperation = MutableObject.mutableCopy(futureOperation);
          updated.push(this.currentOperation);
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
          updated.push(this.currentOperation);
          this.currentOperation = null;
        }
        updated = updated.concat(currentResults);
      }
      deltaSeconds -= delta;
    }
    return updated;
  }

  highestPriorityAvailableOperation(parents) {
    for (let index in this.operations) {
      let operation = this.operations[index];
      if (operation.isAvailableForPlayer(parents.player)) {
        return operation;
      }
    }
    return null;
  }
}
