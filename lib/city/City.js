const UUIDjs = require('uuid-js');

const CityEvent = require('./CityEvent.js').CityEvent;
const UtilsJS = require('../_base/utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

const BuildingJS = require('./Building.js');

const Building = BuildingJS.Building;

export class OverlappingBuildingError extends Error {
}

export default class City {
  constructor({ } = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.buildings = {};
  }

  planBuilding({ building = null } = { }) {
    let b = MutableObject.mutableCopy(building);
    this.buildings[b.id] = b;

    return new CityEvent({
      type:CityEvent.kBuildingPlannedEvent,
      object:b
    });
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
