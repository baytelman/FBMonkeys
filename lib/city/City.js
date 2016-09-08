const UUIDjs = require('uuid-js');
const SquareCoordinateJS = require('../_base/SquareCoordinate.js');

const CityEvent = require('./CityEvent.js').CityEvent;
const UtilsJS = require('../_base/utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

const BuildingJS = require('./Building.js');

const Building = BuildingJS.Building;
const SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

const BuildingActions = require('../../actions/BuildingActions.js');

export class OverlappingBuildingError extends Error {
}

export class City {
  constructor({ defaultBuilding = new Building() } = {}) {
    this.id = UUIDjs.create().toString();
    this.limits = [0, 0, 0, 0];
    this.time = 0;
    this.buildings = {};

    if (defaultBuilding) {
      this.planBuilding({
        building: defaultBuilding
      });
    }
  }

  planBuilding({ building = null, location = new SquareCoordinate(0,0) } = { }) {
    if (!this.canBuildAtLocation(location)) {
      throw new OverlappingBuildingError("Existing building on " + location);
    }
    let b = MutableObject.mutableCopy(building);
    b.location = location;
    this.buildings[b.id] = b;

    this.limits = [
      Math.min(this.limits[0], location.x),
      Math.min(this.limits[1], location.y),
      Math.max(this.limits[2], location.x),
      Math.max(this.limits[3], location.y),
    ];

    return new CityEvent({
      type:CityEvent.kBuildingPlannedEvent,
      object:b
    });
  }

  buildingAtLocation(location) {
    for (var id in this.buildings) {
      let existingBuilding = this.buildings[id];
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
    Object.values(this.buildings).map(function(building) {
      return building.updateTime(deltaSeconds, parents);
    }).forEach(function(_updated) {
      updated = updated.concat(_updated);
    });
    return updated;
  }
}
