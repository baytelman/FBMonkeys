class ProjectAlreadyCompletedError extends Error {

}

class Project {
  constructor({ name = "City Hall", costs = [], effects = [] } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;

    this.time = 0;

    this.costs = costs;
    this.completed = [];
    /* Copy effects, because we will mutate them (start time) */
    this.effects = effects.map(function(obj) { return Object.assign(obj, {}); });
  }

  isCompleted() {
    return this.progress() >= 1;
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

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, { project: this });
    let updated = [];

    if (this.isCompleted()) {
      this.time += deltaSeconds;
      this.effects.forEach(function(effect) {
        let effectUpdate = effect.updateTime(deltaSeconds, parents);
        updated = updated.concat(effectUpdate);
      });
    }

    return updated;
  }
}

class Building extends Project {
  constructor({  } = { }) {
    super(arguments[0]);
    this.location = null;
  }
}

class BuildingConstructionAction extends ResourceConsumingAction {
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
