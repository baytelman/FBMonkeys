import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityEvent from './CityEvent';
import {SpeedEnhancementEffect} from './Effect';

export class ProjectAlreadyCompletedError extends Error {}

export default class CityProject {
  constructor({
    name = "A project",
    description = null,
    namespace = null,
    requirements = [],
    cost = [],
    time = 0,
    permanentEffects = [],
    completionEventType = CityEvent.kProjectCompletedEvent,
    progressEventType = CityEvent.kProjectProgressEvent
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;
    this.description = description;
    this.namespace = (namespace || name.toLowerCase().replace(" ", "_") || this.id);
    this.requirements = requirements;
    this.cost = cost;
    this.permanentEffects = permanentEffects;

    this.setupTime = time;
    this.completionEventType = completionEventType;
    this.progressEventType = progressEventType;

    this.time = 0;
  }

  toString() {
    return this.name + " (" + this.id + ") " + this.getStatus();
  }

  getStatus() {
    if (this.isCompleted()) {
      return "";
    } else {
      return "[" + Math.round(this.progress() * 100) + "% Progress]";
    }
  }

  getDescription() {
    return this.name + " " + this.getStatus();
  }

  remainingTime() {
    return this.time >= this.setupTime
      ? 0
      : this.setupTime - this.time;
  }

  progress() {
    if (this.time >= this.setupTime) {
      return 1;
    }
    return this.time / this.setupTime;
  }

  isCompleted() {
    return this.progress() >= 1;
  }

  complete() {
    /* To be overriden if needed */
  }

  postCompletionUpdateTime(deltaSeconds, parents) {
    return [];
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);

    let timeMultiplier = SpeedEnhancementEffect.apply(this, parents.permanentEffects);
    deltaSeconds *= timeMultiplier;
    let updated = [];

    /* This works for projects with `setupTime == 0` */
    let wasCompleted = this.time > 0 && this.isCompleted();

    this.time += deltaSeconds;
    this.time = Math.round(this.time * 100) / 100;

    if (this.isCompleted()) {
      if (!wasCompleted) {
        updated.push(new CityEvent({type: this.completionEventType, object: this}));
        deltaSeconds = this.time - this.setupTime;
        this.complete();
      }
      updated = updated.concat(this.postCompletionUpdateTime(deltaSeconds, parents));
    } else {
      updated.push(new CityEvent({type: this.progressEventType, object: this}));
    }

    return updated;
  }
}