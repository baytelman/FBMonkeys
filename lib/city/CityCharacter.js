import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import CityEvent from './CityEvent';

export class CityCharacter {
  constructor({
    name = "Unnamed Character",
  } = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.name = name;
    this.time = 0;
  }

  toString() {
    return this.name + " (" + this.id + ") " + this.getStatus();
  }

  updateTime(deltaSeconds, parents) {
      this.time += deltaSeconds;
      return [];
  }
}