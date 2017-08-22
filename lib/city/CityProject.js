import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityEvent from './CityEvent';

export class ProjectAlreadyCompletedError extends Error {}

export default class CityProject {
  constructor({
    name = "A project",
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
    this.namespace = (namespace || name || this.id)
      .toLowerCase()
      .replace(" ", "_");
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
      if (this.permanentEffects.length > 0) {
        return this
          .effects[0]
          .getStatus();
      } else {
        return "";
      }
    } else {
      return "[" + Math.round(this.progress() * 100) + "% Setting Up]";
    }
  }

  remainingTime() {
    return this.time >= this.setupTime? 0 : this.setupTime - this.time;
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