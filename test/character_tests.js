import {assert} from 'chai';

import {MutableObject} from "../lib/city/utils/Utils.js";

import City from '../lib/city/City.js';
import {CityResource} from '../lib/city/CityResource.js';
import {Building} from '../lib/city/Building.js';
import {CityPlayer, PlayerEarnResourceEffect} from '../lib/city/CityPlayer.js';
import {CityCharacter} from '../lib/city/CityCharacter.js';

const kCharacter = 'character';
const character = (amount) => new CityResource(kCharacter, amount);

describe('Player\'s Characters', () => {
  let charName = 'character name';
  let newPlayer = () => new CityPlayer({
    initialCapacity: {
      [kCharacter]: 3
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
  });
});
