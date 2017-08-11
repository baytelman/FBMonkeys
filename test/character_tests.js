import {assert} from 'chai';

import {MutableObject} from "../lib/city/utils/Utils.js";

import City from '../lib/city/City.js';
import {CityResource} from '../lib/city/CityResource.js';
import {Building} from '../lib/city/Building.js';
import {CityPlayer, PlayerEarnResourceEffect} from '../lib/city/CityPlayer.js';
import {CityCharacter} from '../lib/city/CityCharacter.js';
import {CityPlayer, PlayerEarnResourceEffect, BuildingStoreResourceEffect} from '../lib/city/CityPlayer.js';

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
  
  const kGold = 'gold';
  const gold = (amount) => new CityResource(kGold, amount);
  const amount = 100;
  
  it('Can be assigned roles', () => {
    const player = newPlayer();
    player.earnResources([character(2)]);
    player.updateTime(1);
    
    const char1 = Object.values(player.city.characters)[0];
    const char2 = Object.values(player.city.characters)[1];
    
    let resource = gold(amount);
    let resources = [resource];
    let time = 10;
    
    const tasks = new CityTask({
      effects: [new PlayerEarnResourceEffect({resources: resources, frequency: time})]
    });
    
    char2.assignTasks([role1]);
    
  });
});
