class Building {
  constructor({ name = "City Hall", costs = [], buildTime = 0, generateResources = [], resourcesFrequency = false } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;

    this.location = null;
    this.time = 0;

    this.costs = costs;
    this.buildTime = buildTime;

    this.generateResources = generateResources;
    this.resourcesFrequency = resourcesFrequency;
    this.lastGeneratedResources = 0;
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
    let updated = [];

    let wasBuild = this.isBuilt();
    this.time += deltaSeconds;

    if (wasBuild != this.isBuilt()) {
      updated.push(this);
    }

    if (this.resourcesFrequency) {
      let earned;
      do {
        earned = false;
        let nextGeneration = (this.lastGeneratedResources?
          this.lastGeneratedResources + this.resourcesFrequency :
          this.buildTime + this.resourcesFrequency
        );

        if (nextGeneration <= this.time) {
          updated = updated.concat(this.generateResources);
          parents.player.earnResources(this.generateResources);
          this.lastGeneratedResources = nextGeneration;
          earned = true;
        }
      } while (earned);
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
