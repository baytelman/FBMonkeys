import UUIDjs from 'uuid-js';

import { MutableObject } from './utils/Utils';
import CityEvent, {
  kBuildingPlannedEvent,
  kBuildingCompletedEvent,
  kCharacterAddedEvent,
  kCharacterRemovedEvent
} from './CityEvent';
import { ResourceStoringModifierEffect } from './CityBuilding';

export class OverlappingBuildingError extends Error {}

export default class City {
  constructor({
    time = 0,
    seasonPeriod = 60,
    seasonAffectedResource,
    buildings = {},
    characters = {}
  } = {}) {
    this.id = UUIDjs.create().toString();

    this.seasonPeriod = seasonPeriod;
    this.seasonAffectedResource = seasonAffectedResource;

    this.currentYear = -1;
    this.currentSeason = -1;
    this.seasonPermanentEffect = null;

    this.time = time;
    this.buildings = buildings;
    this.characters = characters;
  }

  planBuilding({ building = null, x, y, complete = false } = {}) {
    let b = MutableObject.mutableCopy(building);
    b.x = x;
    b.y = y;
    this.buildings[b.id] = b;
    if (complete) {
      b.complete();
    }

    return new CityEvent({
      type: complete ? kBuildingCompletedEvent : kBuildingPlannedEvent,
      object: b
    });
  }

  getAllBuildings() {
    return Object.values(this.buildings);
  }

  getCompletedBuildings() {
    return Object.values(this.buildings).filter(b => b.isCompleted());
  }

  addCharacter({ type = null, character = null } = {}) {
    character.type = type;
    let c = MutableObject.mutableCopy(character);
    this.characters[c.id] = c;
    return new CityEvent({ type: kCharacterAddedEvent, object: c });
  }

  removeCharacter(id) {
    let c = this.characters[id];
    delete this.characters[id];
    return new CityEvent({ type: kCharacterRemovedEvent, object: c });
  }

  _updateBuildings(deltaSeconds, parents) {
    var updated = [];
    Object.values(this.buildings)
      .map(function(building) {
        return building.updateTime(deltaSeconds, parents);
      })
      .forEach(function(_updated) {
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
      const expectedCharacterCount =
        (player.resources[type] && player.resources[type].amount) || 0;
      let actualCharacterCount = Object.values(player.city.characters).filter(
        c => c.type === type
      ).length;

      let factory = player.characterFactories[type];
      while (actualCharacterCount < expectedCharacterCount) {
        ++actualCharacterCount;
        if (
          !factory.requirements ||
          player.fulfillsRequirements(
            null,
            factory.requirements,
            actualCharacterCount
          )
        ) {
          updated.push(
            this.addCharacter({
              type: type,
              character: factory.produceCharacter()
            })
          );
        } else {
          break;
        }
      }
    });

    Object.values(this.characters)
      .map(function(character) {
        return character.updateTime(deltaSeconds, parents);
      })
      .forEach(function(_updated) {
        updated = updated.concat(_updated);
      });
    return updated;
  }

  getActivePermamentEffects(type) {
    return [this.seasonPermanentEffect].filter(e => !type || e instanceof type);
  }

  updateTime(deltaSeconds, parents) {
    parents = Object.assign(parents, { city: this });
    this.time += deltaSeconds;

    let year = Math.floor(this.time / (this.seasonPeriod * 4));
    let season = Math.floor(
      (this.time - year * this.seasonPeriod * 4) / this.seasonPeriod
    );

    if (this.currentSeason !== season || this.currentYear !== year) {
      this.currentSeason = season;
      this.currentYear = year;
      this.seasonPermanentEffect = new ResourceStoringModifierEffect({
        resourceType: this.seasonAffectedResource,
        season: season
      });
    }

    let updated = [];
    updated = updated.concat(this._updateBuildings(deltaSeconds, parents));
    updated = updated.concat(this._updateCharacters(deltaSeconds, parents));
    return updated;
  }
}
