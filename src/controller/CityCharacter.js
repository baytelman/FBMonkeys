import UUIDjs from 'uuid-js';

import { MutableObject } from './utils/Utils';
import CityEvent, { kCharacterTasksAssigned, kSpendResourceEvent } from './CityEvent';
import { PeriodicEffect } from './Effect';

export default class CityCharacter {
  constructor({ name = 'Unnamed Character', periodicEffects = [], tasks = [] } = {}) {
    this.id = UUIDjs.create().toString();
    this.name = name;

    this.time = 0;
    this.periodicEffects = periodicEffects;
    this.tasks = tasks;
    this.activeTask = null;
  }

  toString() {
    return this.name + ' (' + this.id + ')';
  }

  setTasks(tasks) {
    this.tasks = tasks;
    let event = new CityEvent({
      type: kCharacterTasksAssigned,
      object: this,
      data: tasks
    });
    return event;
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, { character: this });
    let updated = [];
    this.time += deltaSeconds;

    this.periodicEffects.forEach(e => {
      let events = e.updateTime(deltaSeconds, parents);
      updated = updated.concat(events);
    });

    while (deltaSeconds > 0) {
      if (!this.activeTask) {
        const unblockedTasks = this.tasks.filter(t => !t.shouldBeBlocked(parents));
        if (unblockedTasks.length > 0) {
          this.activeTask = MutableObject.mutableCopy(unblockedTasks[0]);
          updated.push(
            new CityEvent({
              type: kCharacterTasksAssigned,
              object: this,
              data: this.tasks
            })
          );
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

export class CharacterConsumeResourceOrGetsRemovedEffect extends PeriodicEffect {
  constructor({ resources = [], period = 1 } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  trigger(parents) {
    let character = parents.character;
    let event;
    if (parents.player.canAfford(this.resources)) {
      event = new CityEvent({
        type: kSpendResourceEvent,
        object: this,
        data: character
      });
      parents.player.spendResources(this.resources);
    } else {
      event = parents.player.city.removeCharacter(character.id);
    }
    return [event];
  }
  getDescription() {
    return (
      'Gives ' +
      this.resources.map(r => r.toString()).join(' + ') +
      ' every ' +
      this.period +
      ' sec'
    );
  }
}
