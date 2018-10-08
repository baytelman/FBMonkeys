import PropTypes from 'prop-types';

import { MutableObject } from './utils/Utils';
import CityProject from './CityProject';
import {
  CityResource,
  ResourceConsumingAction,
  InsuficientResourcesError
} from './CityResource';
import CityEvent, {
  kBuildingCompletedEvent,
  kBuildingProgressEvent,
  kActionAbortedEvent,
  kEarnResourceEvent,
  kStoreResourceEvent
} from './CityEvent';
import { PeriodicEffect, ResourceEffect } from './Effect';

export class ProjectAlreadyCompletedError extends Error {}

export default class CityBuilding extends CityProject {
  constructor({
    name = 'CityBuilding',
    x = 0,
    y = 0,
    costFactor = 2,
    periodicEffects = [],
    ...params
  } = {}) {
    super({
      name,
      completionEventType: kBuildingCompletedEvent,
      progressEventType: kBuildingProgressEvent,
      ...params
    });
    this.costFactor = costFactor;
    this.periodicEffects = periodicEffects;
    this.x = x;
    this.y = y;

    this.storedResources = false;
  }

  getStatus() {
    if (this.isCompleted() && this.periodicEffects.length > 0) {
      return this.periodicEffects.map(e => e.getStatus()).join('\n');
    }
    return super.getStatus();
  }

  storeResources(resources) {
    this.storedResources = CityResource.aggregateSameTypeResources(
      resources.concat(this.storedResources || [])
    );
  }

  getStoredResources() {
    return this.storedResources;
  }

  getCollectingTask(player) {
    let collectingTask = null;
    Object.values(player.city.characters)
      .map(c => c.activeTask)
      .filter(
        at =>
          at instanceof CollectBuildingResourcesEffect && at.building === this
      )
      .forEach(at => (collectingTask = at));
    return collectingTask;
  }

  canCollectResources(player, task) {
    const collectingTask = this.getCollectingTask(player);
    return (
      (!collectingTask || collectingTask === task) &&
      this.storedResources &&
      player.canEarnAnyResources(this.storedResources)
    );
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
        event = new CityEvent({
          type: kActionAbortedEvent,
          object: this
        });
      }
      this.storedResources = false;
      return event;
    }
    let event = new CityEvent({
      type: kEarnResourceEvent,
      object: this,
      data: this.storedResources
    });
    player.earnResources(this.storedResources);
    this.storedResources = false;
    return event;
  }

  onComplete() {
    /* We will mutate (update time) of these */
    this.periodicEffects = this.periodicEffects.map(MutableObject.mutableCopy);
  }

  postCompletionUpdateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, { building: this });
    let updated = [];
    this.periodicEffects.forEach(function(effect) {
      let effectUpdate = effect.updateTime(deltaSeconds, parents);
      updated = updated.concat(effectUpdate);
    });
    return updated;
  }
}

export class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({ building, x, y }) {
    super(
      'Build',
      function(player) {
        return player.fulfillsRequirements(
          this.building.namespace,
          this.building.requirements
        );
      },
      function(player) {
        let factor = 1;
        if (this.building.namespace) {
          const sameBuilding = Object.values(player.city.buildings).filter(
            b => b.namespace === this.building.namespace
          ).length;
          factor = Math.pow(this.building.costFactor, sameBuilding);
        }
        return CityResource.resourcesWithMultiplier(this.building.cost, factor);
      },
      function(player) {
        return player.city.planBuilding({ ...this });
      }
    );
    this.building = building;
    this.x = x;
    this.y = y;
  }
}

const BLOCKED_STORAGE_IS_TAKEN = 'Already is storing resources';
export class BuildingStoreResourceEffect extends PeriodicEffect {
  constructor({ resources = [], ...params } = {}) {
    super({
      name: 'Produce',
      ...params
    });
    this.resources = resources;
  }
  shouldBeBlocked(parents) {
    return (
      parents.building.getStoredResources() !== false &&
      BLOCKED_STORAGE_IS_TAKEN
    );
  }
  trigger(parents) {
    let effects = parents.permanentEffects.filter(
      effect => effect instanceof ResourceStoringModifierEffect
    );

    let modifiers = {
      multipliers: {}
    };
    effects.forEach(effect => effect.combine(modifiers));

    let modifiedResources = this.resources.map(r =>
      r.resourceWithMultiplier(1 + (modifiers.multipliers[r.namespace] || 0))
    );

    let event = new CityEvent({
      type: kStoreResourceEvent,
      object: this,
      data: modifiedResources
    });
    parents.building.storeResources(modifiedResources);
    return [event];
  }
  getDescription() {
    return (
      'Stores ' +
      this.resources.map(r => r.toString()).join(' + ') +
      ' every ' +
      this.period +
      ' sec'
    );
  }
}

const BLOCKED_COLLECT_ALREADY_ASSIGNED =
  'A character is already assigned for collecting';
export class CollectBuildingResourcesEffect extends PeriodicEffect {
  constructor({ allowedBuildings = [], period = 1 } = {}) {
    super(arguments[0]);
    this.building = null;
    this.allowedBuildings = allowedBuildings;
  }
  shouldBeBlocked(parents) {
    return (
      !Object.values(parents.player.city.buildings)
        .filter(
          b =>
            this.allowedBuildings.length === 0 ||
            this.allowedBuildings.indexOf(b.namespace) >= 0
        )
        .filter(b => b.canCollectResources(parents.player)).length > 0 &&
      BLOCKED_COLLECT_ALREADY_ASSIGNED
    );
  }
  began(parents) {
    let building = Object.values(parents.player.city.buildings)
      .filter(
        b =>
          this.allowedBuildings.length === 0 ||
          this.allowedBuildings.indexOf(b.namespace) >= 0
      )
      .filter(b => b.canCollectResources(parents.player))[0];
    if (!building || !building.getStoredResources()) {
      throw new InsuficientResourcesError();
    }
    this.building = building;
    return [];
  }
  trigger(parents) {
    if (this.building.canCollectResources(parents.player, this)) {
      const event = this.building.collectResources(parents.player, this);
      this.building = null;
      return [event];
    }
    return [];
  }
  getDescription() {
    return 'Collect';
  }
}

export class ResourceStoringModifierEffect extends ResourceEffect {
  constructor({ resourceType, season } = {}) {
    let multiplier;
    let name;
    if (season === 0) {
      name = 'Spring';
      multiplier = 0.5;
    } else if (season === 1) {
      name = 'Summer';
      multiplier = 0.2;
    } else if (season === 2) {
      name = 'Fall';
      multiplier = -0.2;
    } else {
      name = 'Winter';
      multiplier = -0.75;
    }
    super({
      multipliers: {
        [resourceType]: multiplier
      }
    });
    this.name = name;
    this.effect =
      (multiplier > 0 ? '+' : '-') +
      Math.abs(Math.round(100 * multiplier)) +
      '%';
  }

  description() {
    return this.name + ' [' + this.effect + ']';
  }
}

CityBuilding.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};
