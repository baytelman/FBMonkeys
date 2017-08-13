import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityEvent from './CityEvent';

export class CityCharacter {
  constructor({
    name = "Unnamed Character",
    tasks = [],
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;

    this.time = 0;
    this.tasks = tasks;
    this.activeTask = null;
  }

  toString() {
    return this.name + " (" + this.id + ") " + this.getStatus();
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, {character: this});
    let updated = [];
    this.time += deltaSeconds;
    while (deltaSeconds > 0) {
      if (!this.activeTask) {
        const unblockedTasks = this
          .tasks
          .filter(t => t.canBegin(parents));
        if (unblockedTasks.length > 0) {
          this.activeTask = MutableObject.mutableCopy(unblockedTasks[0]);
        }
      }
      if (this.activeTask) {
        const task = this.activeTask;
        /* If task can be finished, finish it and loop again: */
        let addTime = task.missingTime();
        if (addTime > deltaSeconds) {
          addTime = deltaSeconds;
        } else {
          this.activeTask = null;
        }
        let effectUpdate = task.updateTime(addTime, parents);
        updated = updated.concat(effectUpdate);
        deltaSeconds -= addTime;
      } else {
        break;
      }
    }
    return updated;
  }
}