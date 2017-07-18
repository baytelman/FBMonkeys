const Event = require('../_base/Event.js').Event;

export class CityEvent extends Event {
}

CityEvent.kEarnResourceEvent = 'EarnResource';
CityEvent.kSpendResourceEvent = 'SpendResource';

CityEvent.kBuildingPlannedEvent = 'BuildingPlanned';
CityEvent.kBuildingCompletedEvent = 'BuildingCompleted';
CityEvent.kBuildingProgressEvent = 'BuildingProgress';
