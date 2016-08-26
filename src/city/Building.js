class Building {
  constructor({ name = "City Hall", costs = [], buildTime = 0, effects = [] } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;

    this.location = null;
    this.time = 0;

    this.costs = costs;
    this.buildTime = buildTime;

    this.effects = effects.map(function(obj) { return Object.assign(obj, {}); });
  }

  isBuilt() {
    return this.time >= this.buildTime;
  }

  buildProgress() {
    if (this.isBuilt()) {
      return 1.0;
    }
    return this.time / (1.0 * this.buildTime);
  }

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, { building: this });
    let updated = [];

    let wasBuild = this.isBuilt();
    this.time += deltaSeconds;

    if (wasBuild != this.isBuilt()) {
      updated.push(this);
    }

    if (this.isBuilt()) {
      this.effects.forEach(function(effect) {
        let effectUpdate = effect.updateTime(deltaSeconds, parents);
        updated = updated.concat(effectUpdate);
      });
    }

    return updated;
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
