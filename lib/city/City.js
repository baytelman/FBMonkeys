var UUIDjs = require('uuid-js');
var SquareCoordinateJS = require('../_base/SquareCoordinate.js');

var BuildingJS = require('./Building.js');

var Building = BuildingJS.Building;
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

export class OverlappingBuildingError extends Error {
}

export class City {
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

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, { city: this });
    this.time += deltaSeconds;
    var updated = [];
    this.buildings.map(function(building) {
      return building.updateTime(deltaSeconds, parents);
    }).forEach(function(_updated) {
      updated = updated.concat(_updated);
    });
    return updated;
  }
}

