import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityEvent from './CityEvent';
import {FrequencyEffect} from './Effect';

export default class CityCharacter {
  constructor({
    name = "Unnamed Character",
    effects = [],
    tasks = []
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;

    this.time = 0;
    this.effects = effects;
    this.role = null;
    this.activeTask = null;
  }

  toString() {
    return this.name + " (" + this.id + ")";
  }

  setRole(role) {
    this.role = role;
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, {character: this});
    let updated = [];
    this.time += deltaSeconds;

    this.effects.forEach(e => {
      let events = e.updateTime(deltaSeconds, parents);
      updated = updated.concat(events);
    });

    while (deltaSeconds > 0) {
      if (!this.activeTask && this.role && this.role.tasks) {
        const unblockedTasks = this
          .role
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

export class CharacterConsumeResourceOrGetsRemovedEffect extends FrequencyEffect {
  constructor({
    resources = [],
    period = 1
  } = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  trigger(parents) {
    let character = parents.character;
    let event;
    if (parents.player.canAfford(this.resources)) {
      event = new CityEvent({type: CityEvent.kSpendResourceEvent, object: this, data: character});
      parents
        .player
        .spendResources(this.resources);
    } else {
      event = parents
        .player
        .city
        .removeCharacter(character.id)
    }
    return [event];
  }
  getDescription() {
    return "Gives " + this
      .resources
      .map(r => r.toString())
      .join(" + ") + " every " + this.period + " sec";
  }
}

export class CityRole {
  constructor({
    name = "Unnamed Role",
    namespace = "role",
    tasks = []
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;
    this.namespace = namespace;
    this.tasks = tasks;
  }

  toString() {
    return this.name + " (" + this.id + ")";
  }
}
