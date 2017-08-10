import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import {CityResource, ResourceConsumingAction} from './CityResource';
import CityEvent from './CityEvent';

export class ProjectAlreadyCompletedError extends Error {}

export class Building {
  constructor({
    name = "City Hall",
    namespace = null,
    requirements = [],
    costs = [],
    costFactor = 1.3,
    time = 0,
    effects = [],
    permanentEffects = []
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;
    this.namespace = namespace || name
      .toLowerCase()
      .replace(" ", "_");

    this.requirements = requirements;
    this.costs = costs;
    this.costFactor = costFactor;
    this.buildingTime = time;

    this.storedResources = false;

    this.effects = effects;
    this.permanentEffects = permanentEffects;

    this.time = 0;
  }

  toString() {
    return this.name + " (" + this.id + ") " + this.getStatus();
  }

  getStatus() {
    if (this.isCompleted()) {
      if (this.effects.length > 0) {
        return this
          .effects[0]
          .getStatus();
      } else {
        return "";
      }
    } else {
      return "[" + Math.round(this.progress() * 100) + "% Building]";
    }
  }

  storeResources(resources) {
    this.storedResources = CityResource.aggregateSameTypeResources(resources.concat(this.storedResources || []));
  }

  getStoredResources() {
    return this.storedResources;
  }

  collectResources(player) {
    if (!this.storedResources) {
      throw new InsuficientResourcesError();
    }
    let event = new CityEvent({type: CityEvent.kEarnResourceEvent, object: this, data: this.storedResources});
    player.earnResources(this.storedResources);
    this.storedResources = false;
    return event;
  }

  progress() {
    if (this.time >= this.buildingTime) {
      return 1;
    }
    return this.time / this.buildingTime;
  }

  isCompleted() {
    return this.progress() >= 1;
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, {building: this});
    let updated = [];

    /* This works for buildings with `buildingTime == 0` */
    let wasCompleted = this.time > 0 && this.isCompleted();

    this.time += deltaSeconds;
    this.time = Math.round(this.time * 100) / 100;

    if (this.isCompleted()) {
      if (!wasCompleted) {
        /* Copy effects, because we will mutate them (start time) */
        this.effects = this
          .effects
          .map(MutableObject.mutableCopy);
        this.permanentEffects = this
          .permanentEffects
          .map(MutableObject.mutableCopy);

        updated.push(new CityEvent({type: CityEvent.kBuildingCompletedEvent, object: this}));
        deltaSeconds = this.time - this.buildingTime;
      }

      this
        .effects
        .forEach(function (effect) {
          let effectUpdate = effect.updateTime(deltaSeconds, parents);
          updated = updated.concat(effectUpdate);
        });
    } else {
      updated.push(new CityEvent({type: CityEvent.kBuildingProgressEvent, object: this}));
    }

    return updated;
  }
}

export class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({building}) {
    super("Build", function (player) {
      return player.fulfillsRequirements(this.building.requirements);
    }, function (player) {
      let factor = 1;
      if (this.building.namespace) {
        const achievements = player.getAchievements({completedOnly: false});
        factor = Math.pow(this.building.costFactor, achievements[this.building.namespace] || 0);
      }
      return CityResource.resourcesWithMultiplier(this.building.costs, factor);
    }, function (player) {
      player
        .city
        .planBuilding({building: this.building});
    });
    this.building = building;
  }
}
