import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import {CityResource, ResourceConsumingAction} from './CityResource';
import {CityBuilding} from './CityBuilding';

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
CityEvent.kStoreResourceEvent = 'StoreResource';

CityEvent.kProjectCompletedEvent = 'ProjectCompleted';
CityEvent.kProjectProgressEvent = 'ProjectProgress';

CityEvent.kBuildingPlannedEvent = 'BuildingPlanned';
CityEvent.kBuildingCompletedEvent = 'BuildingCompleted';
CityEvent.kBuildingProgressEvent = 'BuildingProgress';

CityEvent.kCharacterAddedEvent = 'CharacterAdded';
CityEvent.kCharacterRemovedEvent = 'CharacterRemoved';
CityEvent.kActionAbortedEvent = 'ActionAborted';
CityEvent.kTaskAbortedEvent = 'TaskAborted';
