import UUIDjs from 'uuid-js';

import {MutableObject} from './utils/Utils';
import {CityResource, ResourceConsumingAction} from './CityResource';
import CityEvent from './CityEvent';

import {Building} from './Building';

export class OverlappingBuildingError extends Error {}

export default class City {
  constructor({} = {}) {
    this.id = UUIDjs
      .create()
      .toString();
    this.time = 0;
    this.buildings = {};
    this.characters = {};
  }

  planBuilding({
    building = null
  } = {}) {
    let b = MutableObject.mutableCopy(building);
    this.buildings[b.id] = b;

    return new CityEvent({type: CityEvent.kBuildingPlannedEvent, object: b});
  }

  addCharacter({
    type = null,
    character = null
  } = {}) {
    character.type = type;
    let c = MutableObject.mutableCopy(character);
    this.characters[c.id] = c;

    return new CityEvent({type: CityEvent.kCharacterAddedEvent, object: c});
  }

  _updateBuildings(deltaSeconds, parents) {
    var updated = [];
    Object
      .values(this.buildings)
      .map(function (building) {
        return building.updateTime(deltaSeconds, parents);
      })
      .forEach(function (_updated) {
        updated = updated.concat(_updated);
      });
    return updated;
  }

  _updateCharacters(deltaSeconds, parents) {
    var updated = [];
    /* Check if characters need to be created: */
    const player = parents.player;
    const charTypes = Object.keys(player.characterFactories);

    charTypes.forEach(type => {
      const expectedCharacterCount = (player.resources[type] && player.resources[type].amount) || 0;
      let actualCharacterCount = Object
        .values(player.city.characters)
        .filter(c => c.type == type)
        .length;
        
      while (actualCharacterCount < expectedCharacterCount) {
        ++actualCharacterCount;
        this.addCharacter({type: type, character: player.characterFactories[type]()});
      }
    });

    Object
      .values(this.characters)
      .map(function (character) {
        return character.updateTime(deltaSeconds, parents);
      })
      .forEach(function (_updated) {
        updated = updated.concat(_updated);
      });
    return updated;
  }

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, {city: this});
    this.time += deltaSeconds;

    let updated = [];
    updated = updated.concat(this._updateBuildings(deltaSeconds, parents));
    updated = updated.concat(this._updateCharacters(deltaSeconds, parents));
    return updated;
  }
}
