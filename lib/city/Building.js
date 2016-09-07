var UUIDjs = require('uuid-js');

var ResourceJS = require('../_base/Resource');
var UtilsJS = require('../_base/utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

var Resource = ResourceJS.Resource;
var ResourceConsumingAction = ResourceJS.ResourceConsumingAction;

export class ProjectAlreadyCompletedError extends Error {

}

export class Project {
  constructor({ name = "City Hall", costs = [], effects = [] } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;

    this.time = 0;

    this.costs = costs;
    this.completed = [];

    /* Copy effects, because we will mutate them (start time) */
    this.effects = effects.map(MutableObject.mutableCopy);
  }

  toString() {
    return this.constructor.name + " (" + this.id + ") [" + Math.round(this.progress()*100) + "%]";
  }

  canCompleteWithAnyOfResources(resources) {
    for (let index in resources) {
      let resource = resources[index];
      if (resource.amount > 0 && this.canCompleteResource(resource.type)) {
        return resource.type;
      }
    }
    return null;
  }

  canCompleteResource(type) {
    let costs = this.costs.filter((c) => { return c.type === type});
    if (costs.length === 0) {
      return false;
    }
    let complete = this.completed.filter((c) => { return c.type === type});
    if (complete.length === 0) {
      return (costs[0]).amount > 0;
    }
    return (costs[0]).amount > (complete[0]).amount;
  }

  complete(resources) {
    if (this.isCompleted()) {
      throw new ProjectAlreadyCompletedError();
    }
    this.completed = Resource.aggregateSameTypeResources(this.completed.concat(resources));
    return this.isCompleted();
  }

  progress() {
    if (this.time > 0) {
      return 1;
    }
    return Resource.resourcesCoverCosts(this.completed, this.costs);
  }

  isCompleted() {
    return this.progress() >= 1;
  }

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, { project: this });
    let updated = [];

    if (this.isCompleted()) {
      this.time += deltaSeconds;
      this.time = Math.round(this.time*100)/100;
      this.effects.forEach(function(effect) {
        let effectUpdate = effect.updateTime(deltaSeconds, parents);
        updated = updated.concat(effectUpdate);
      });
    }

    return updated;
  }
}

export class Building extends Project {
  constructor({  } = { }) {
    super(arguments[0]);
    this.location = null;
  }
}

export class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({ building, location }) {
    super(
      "Build",
      function(player) { return player.city.canBuildAtLocation(location); },
      function(player) { return building.costs; },
      function(player) {
        player.city.addBuilding({
          building: building,
          location: location
        });
      }
    );
  }
}
