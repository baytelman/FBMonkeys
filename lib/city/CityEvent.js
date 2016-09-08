const Event = require('../_base/Event.js').Event;

export class CityEvent extends Event {
}

CityEvent.kEarnResourceEvent = 'EarnResource';
CityEvent.kSpendResourceEvent = 'SpendResource';
CityEvent.kConsumedResourceEvent = 'ConsumedResource';

CityEvent.kBuildingPlannedEvent = 'BuildingPlanned';
CityEvent.kBuildingCompletedEvent = 'BuildingCompleted';
CityEvent.kBuildingProgressEvent = 'BuildingProgress';

CityEvent.kCharacterOperationBeganEvent = 'CharacterOperationBegan';
CityEvent.kCharacterOperationCompletedEvent = 'CharacterOperationCompleted';
CityEvent.kCharacterOperationProgressEvent = 'CharacterOperationProgress';
