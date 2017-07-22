const Event = require('./CityEvent.js').Event;
const UUIDjs = require('uuid-js');
const UtilsJS = require('./utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

export default class CityEvent {
  constructor({type = "event", object = null, data = {}} = {}) {
    this.id = UUIDjs.create().toString();

    this.type = type;
    this.object = MutableObject.copy(object);
    this.data = MutableObject.copy(data);
  }
  toString() {
    return "[" + this.type + "] " + this.object;
  }
}

CityEvent.kEarnResourceEvent = 'EarnResource';
CityEvent.kSpendResourceEvent = 'SpendResource';

CityEvent.kBuildingPlannedEvent = 'BuildingPlanned';
CityEvent.kBuildingCompletedEvent = 'BuildingCompleted';
CityEvent.kBuildingProgressEvent = 'BuildingProgress';
