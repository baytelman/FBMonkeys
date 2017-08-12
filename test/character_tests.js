import {assert} from 'chai';

import {MutableObject} from "../lib/city/utils/Utils.js";

import City from '../lib/city/City.js';
import {CityResource} from '../lib/city/CityResource.js';
import {Building, CollectBuildingResourcesEffect, BuildingStoreResourceEffect} from '../lib/city/Building.js';
import {CityPlayer, PlayerEarnResourceEffect } from '../lib/city/CityPlayer.js';
import {CityCharacter} from '../lib/city/CityCharacter.js';

const kCharacter = 'character';
const character = (amount) => new CityResource(kCharacter, amount);

describe('Player\'s Characters', () => {

  const kGold = 'gold';
  const gold = (amount) => new CityResource(kGold, amount);
  const kWood = 'wood';
  const wood = (amount) => new CityResource(kWood, amount);
  const amount = 100;

  let time = 10;

  const charName = 'character name';
  const newPlayer = () => new CityPlayer({
    initialCapacity: {
      [kCharacter]: 3,
      [kGold]: amount * 2,
      [kWood]: amount * 10
    },
    characterFactories: {
      [kCharacter]: () => new CityCharacter({name: charName})
    }
  });

  it('Are listed', () => {
    const player = newPlayer();
    assert.equal(0, Object.values(player.city.characters).length);

    player.earnResources([character(2)]);
    player.updateTime(1);

    assert.equal(2, Object.values(player.city.characters).length);
    const char1 = Object.values(player.city.characters)[0];
    const char2 = Object.values(player.city.characters)[1];
    assert.equal(charName, char1.name);
    assert.equal(charName, char2.name);
  });

  it('Can be assigned tasks, rotate as completed', () => {
    const player = newPlayer();
    player.earnResources([character(2)]);
    player.updateTime(1);

    const char1 = Object.values(player.city.characters)[0];

    const task1 = new PlayerEarnResourceEffect({
      resources: [gold(amount)],
      frequency: time
    });
    const task2 = new PlayerEarnResourceEffect({
      resources: [wood(amount)],
      frequency: time
    });

    char1.tasks = [task1, task2];
    player.updateTime(1);

    assert.equal(char1.activeTask, task1);
    player.updateTime(time);

    assert.isTrue(player.canAfford([gold(amount)]));
    assert.isFalse(player.canAfford([gold(2 * amount)]));

    assert.equal(char1.activeTask, task1);
    player.updateTime(time);

    assert.isTrue(player.canAfford([gold(2 * amount)]));
    assert.isFalse(player.canAfford([wood(amount)]));
    assert.equal(char1.activeTask, task2);
    player.updateTime(time);
    assert.isTrue(player.canAfford([wood(amount)]));
    assert.isFalse(player.canAfford([gold(3 * amount)]));
  });

  it('can collect resources', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kCharacter]: 3,
        [kGold]: 1000
      },
      characterFactories: {
        [kCharacter]: () => new CityCharacter({name: charName})
      }
    });
    let resource = gold(amount);
    let resources = [resource];

    let storingBuilding = new Building({
      effects: [new BuildingStoreResourceEffect({resources: resources, frequency: time})]
    });
    player
      .city
      .planBuilding({building: storingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];

    player.earnResources([character(2)]);
    player.updateTime(1);
    const char1 = Object.values(player.city.characters)[0];

    const collectTask = new CollectBuildingResourcesEffect({frequency: time});
    char1.tasks = [collectTask];
    player.updateTime(1);

    /* Nothing to pickup */
    assert.isNull(char1.activeTask);
    assert.isFalse(plannedBuilding.getStoredResources());

    /* Building finished production, picking up */
    player.updateTime(time);
    assert.isNotFalse(plannedBuilding.getStoredResources());
    assert.equal(char1.activeTask, collectTask);

    /* Finished picking up */
    player.updateTime(time);
    assert.isNull(char1.activeTask);
    assert.isFalse(plannedBuilding.getStoredResources());
    assert.isTrue(player.canAfford(resources));
  });
});
