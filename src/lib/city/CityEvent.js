import UUIDjs from "uuid-js";
import PropTypes from "prop-types";

import { MutableObject } from "./utils/Utils";

export default class CityEvent {
  constructor(props) {
    this.type = props.type || "event";
    this.object = props.object && MutableObject.copy(props.object);
    this.data = props.data && MutableObject.copy(props.data);
    this.id = UUIDjs.create().toString();
  }
  toString() {
    return "[" + this.type + "] " + this.object;
  }
  changesSpotsAvailability = () => {
    return [kBuildingCompletedEvent, kBuildingPlannedEvent].indexOf(this.type) !== -1;
  }
  mayChangePlayerFullfilments = () => {
    return [kBuildingCompletedEvent, kEarnResourceEvent, kSpendResourceEvent, kResearchProjectCompletedEvent].indexOf(this.type) !== -1;
  }
}

export const kEarnResourceEvent = "EarnResource";
export const kSpendResourceEvent = "SpendResource";
export const kStoreResourceEvent = "StoreResource";

export const kResearchScheduledEvent = "ResearchScheduled";
export const kResearchProjectCompletedEvent = "ResearchProjectCompleted";
export const kResearchProjectProgressEvent = "ResearchProjectProgress";

export const kEarnResearchEvent = "EarnResearch";
export const kProjectCompletedEvent = "ProjectCompleted";
export const kProjectProgressEvent = "ProjectProgress";

export const kBuildingPlannedEvent = "BuildingPlanned";
export const kBuildingCompletedEvent = "BuildingCompleted";
export const kBuildingProgressEvent = "BuildingProgress";
export const kPeriodicEffectProgressEvent = "PeriodicEffectProgress";
export const kPeriodicEffectBlockedEvent = "PeriodicEffectBlocked";

export const kAvailableAreasChangedEvent = "AvailableAreasChanged";
export const kAvailableBuildingsChangedEvent = "AvailableBuildingsChanged";
export const kAvailableResearchChangedEvent = "AvailableResearchChanged";

export const kCharacterAddedEvent = "CharacterAdded";
export const kCharacterRemovedEvent = "CharacterRemoved";
export const kCharacterTasksAssigned = "CharacterAssigned";

export const kActionAbortedEvent = "ActionAborted";
export const kTaskAbortedEvent = "TaskAborted";

CityEvent.propTypes = {
  type: PropTypes.string.isRequired,
  object: PropTypes.object
};
