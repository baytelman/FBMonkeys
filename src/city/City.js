class OverlappingBuildingError extends Error {
}

class City {
  constructor({ defaultBuilding = new Building() } = {}) {
    this.id = UUIDjs.create().toString();
    this.limits = [0, 0, 0, 0];
    this.buildings = [];
    this.time = 0;

    if (defaultBuilding) {
      this.addBuilding({
        building: defaultBuilding
      });
    }
  }

  addBuilding({ building = building, location = new SquareCoordinate(0,0) } = { }) {
    if (!this.canBuildAtLocation(location)) {
      throw new OverlappingBuildingError("Existing building on " + location);
    }
    building.location = location;
    this.buildings.push(building);
    this.limits = [
      Math.min(this.limits[0], location.x),
      Math.min(this.limits[1], location.y),
      Math.max(this.limits[2], location.x),
      Math.max(this.limits[3], location.y),
    ];
  }

  buildingAtLocation(location) {
    for (var i = 0; i < this.buildings.length; i++) {
      let existingBuilding = this.buildings[i];
      if (existingBuilding.location.is(location)) {
        return existingBuilding;
      }
    }
    return null;
  }

  canBuildAtLocation(location) {
    return this.buildingAtLocation(location) === null;
  }

  updateTime(deltaSeconds) {
    this.time += deltaSeconds;
    var updated = [];
    this.buildings.forEach(function(building) {
      building.updateTime(deltaSeconds).forEach(function(u) {
        updated.push(u);
      });
    });
    return updated;
  }
}

class Building {
  constructor({ name = "Just a building", costs = [], buildTime = 0 } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;
    this.costs = costs;
    this.buildTime = buildTime;

    this.location = null;
    this.time = 0;
  }

  isBuilt() {
    return this.time >= this.buildTime;
  }

  updateTime(deltaSeconds) {
    let wasBuild = this.isBuilt();
    this.time += deltaSeconds;

    if (wasBuild != this.isBuilt()) {
      return [this];
    }
    return [];
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
      });
    }
}
