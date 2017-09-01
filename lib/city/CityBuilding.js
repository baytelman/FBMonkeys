import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityProject from './CityProject';
import {CityResource, ResourceConsumingAction, InsuficientResourcesError, UnavailableActionError} from './CityResource';
import CityEvent from './CityEvent';
import {FrequencyEffect, ResourceEffect} from './Effect';

export class ProjectAlreadyCompletedError extends Error {}

export default class CityBuilding extends CityProject {
  constructor({
    name = "CityBuilding",
    costFactor = 2,
    effects = []
  } = {}) {
    let params = Object.assign(arguments[0] || {}, {
      name: name,
      costFactor: costFactor,
      effects: effects,
      completionEventType: CityEvent.kBuildingCompletedEvent,
      progressEventType: CityEvent.kBuildingProgressEvent
    });
    super(params);

    this.costFactor = costFactor;
    this.storedResources = false;
    this.effects = effects;
  }

  getStatus() {
    if (this.isCompleted() && this.effects.length > 0) {
      return this
        .effects[0]
        .getStatus();
    }
    return super.getStatus();
  }

  storeResources(resources) {
    this.storedResources = CityResource.aggregateSameTypeResources(resources.concat(this.storedResources || []));
  }

  getStoredResources() {
    return this.storedResources;
  }

  getCollectingTask(player) {
    let collectingTask = null;
    Object
      .values(player.city.characters)
      .map(c => c.activeTask)
      .filter(at => at instanceof CollectBuildingResourcesEffect && at.building == this)
      .forEach(at => collectingTask = at);
    return collectingTask;
  }

  canCollectResources(player, task) {
    const collectingTask = this.getCollectingTask(player);
    return (!collectingTask || collectingTask == task) && this.storedResources && player.canEarnAnyResources(this.storedResources);
  }

  collectResources(player, task) {
    if (!this.storedResources) {
      throw new InsuficientResourcesError();
    }
    if (!this.canCollectResources(player, task)) {
      let event;
      if (task) {
        event = task.abort();
      } else {
        event = new CityEvent({type: CityEvent.kActionAbortedEvent, object: this});
      }
      this.storedResources = false;
      return event;
    }
    let event = new CityEvent({type: CityEvent.kEarnResourceEvent, object: this, data: this.storedResources});
    player.earnResources(this.storedResources);
    this.storedResources = false;
    return event;
  }

  complete() {
    /* We will mutate (update time) of these */
    this.effects = this
      .effects
      .map(MutableObject.mutableCopy);
  }

  postCompletionUpdateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, {building: this});
    let updated = [];
    this
      .effects
      .forEach(function (effect) {
        let effectUpdate = effect.updateTime(deltaSeconds, parents);
        updated = updated.concat(effectUpdate);
      });
    return updated;
  }
}

export class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({building}) {
    super("Build", function (player) {
      return player.fulfillsRequirements(this.building.namespace, this.building.requirements);
    }, function (player) {
      let factor = 1;
      if (this.building.namespace) {
        const achievements = player.getAchievements({completedOnly: false});
        factor = Math.pow(this.building.costFactor, achievements[this.building.namespace] || 0);
      }
      return CityResource.resourcesWithMultiplier(this.building.cost, factor);
    }, function (player) {
      player
        .city
        .planBuilding({building: this.building});
    });
    this.building = building;
  }
}

export class BuildingStoreResourceEffect extends FrequencyEffect {
  constructor({
    resources = [],
    period = 1
  } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  canBegin(parents) {
    return parents
      .building
      .getStoredResources() === false;
  }
  trigger(parents) {
    let effects = parents
      .permanentEffects
      .filter(effect => effect instanceof ResourceStoringModifierEffect);

    let modifiers = {
      multipliers: {}
    };
    effects.forEach(effect => effect.combine(modifiers));

    let modifiedResources = this
      .resources
      .map(r => r.resourceWithMultiplier(1 + (modifiers.multipliers[r.namespace] || 0)));

    let event = new CityEvent({type: CityEvent.kStoreResourceEvent, object: this, data: modifiedResources});
    parents
      .building
      .storeResources(modifiedResources);
    return [event];
  }
  getDescription() {
    return "Stores " + this
      .resources
      .map(r => r.toString())
      .join(" + ") + " every " + this.period + " sec";
  }
}

export class CollectBuildingResourcesEffect extends FrequencyEffect {
  constructor({
    allowedBuildings = [],
    period = 1
  } = {}) {
    super(arguments[0]);
    this.building = null;
    this.allowedBuildings = allowedBuildings;
  }
  canBegin(parents) {
    return Object
      .values(parents.player.city.buildings)
      .filter(b => this.allowedBuildings.length == 0 || this.allowedBuildings.indexOf(b.namespace) >= 0)
      .filter(b => b.canCollectResources(parents.player))
      .length > 0;
  }
  began(parents) {
    let building = Object
      .values(parents.player.city.buildings)
      .filter(b => this.allowedBuildings.length == 0 || this.allowedBuildings.indexOf(b.namespace) >= 0)
      .filter(b => b.canCollectResources(parents.player))[0];
    if (!building || !building.getStoredResources()) {
      throw new InsuficientResourcesError();
    }
    this.building = building;
    return [];
  }
  trigger(parents) {
    const event = this
      .building
      .collectResources(parents.player, this);
    this.building = null;
    return [event];
  }
  getDescription() {
    return "Collect";
  }
}

export class ResourceStoringModifierEffect extends ResourceEffect {
  constructor({resourceType, season} = {}) {
    let multiplier;
    let name;
    if (season == 0) {
      name = "Spring";
      multiplier = 0.5;
    } else if (season == 1) {
      name = "Summer";
      multiplier = 0.2
    } else if (season == 2) {
      name = "Fall";
      multiplier = -0.2
    } else {
      name = "Winter";
      multiplier = -0.75
    }
    super({
      multipliers: {
        [resourceType]: multiplier
      }
    });
    this.name = name;
    this.effect = (multiplier > 0
      ? "+"
      : "-") + Math.abs(Math.round(100 * multiplier)) + "%";
  }

  description() {
    return this.name + " [" + this.effect + "]";
  }
}
