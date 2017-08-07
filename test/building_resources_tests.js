const assert = require('chai').assert

const MutableObject = require("../lib/city/utils/Utils.js").MutableObject;

const City = require('../lib/city/City.js').default;

const CityResource = require('../lib/city/CityResource.js').CityResource;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;

import {CityPlayer, PlayerEarnResourceEffect, BuildingStoreResourceEffect} from '../lib/city/CityPlayer.js';

const kGold = 'gold';
const gold = (amount) => new CityResource(kGold, amount);
const amount = 100;

describe('Buildings Effects', () => {
  let resource = gold(amount);
  let resources = [resource];
  let time = 10;
  let grantingBuilding = new Building({
    effects: [new PlayerEarnResourceEffect({resources: resources, frequency: time})]
  });

  let storingBuilding = new Building({
    effects: [new BuildingStoreResourceEffect({resources: resources, frequency: time})]
  });

  it('can grant resources to player', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: 1000
      }
    });
    player
      .city
      .planBuilding({building: grantingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];
    assert.isFalse(plannedBuilding.getStoredResources());

    let multiplier = 4;
    let moreResources = CityResource.resourcesWithMultiplier(resources, multiplier);

    assert.isFalse(player.canAfford(moreResources));
    let updates = player.updateTime(time * (multiplier - 1));
    assert.isFalse(player.canAfford(moreResources));

    updates = player.updateTime(time);
    assert.isTrue(player.canAfford(moreResources));

    assert.isFalse(plannedBuilding.getStoredResources());
    assert.include(plannedBuilding.toString(), 'Producing');
    assert.include(plannedBuilding.effects[0].toString(), 'Producing');
  });

  it('can store resources in building', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: 1000
      }
    });
    player
      .city
      .planBuilding({building: storingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];
    assert.isFalse(plannedBuilding.getStoredResources());

    assert.isFalse(player.canAfford(resources));
    player.updateTime(time + 1);
    
    /* Player has NOT earned the resources yet, but they are ready to be collected */
    assert.isFalse(player.canAfford(resources));
    assert.isNotFalse(plannedBuilding.getStoredResources());

    plannedBuilding.collectResources(player);
    assert.isTrue(player.canAfford(resources));

    player.updateTime(1);

    assert.isFalse(plannedBuilding.getStoredResources());
    assert.include(plannedBuilding.toString(), 'Producing');
    assert.include(plannedBuilding.effects[0].toString(), 'Producing');
  });

  it('are paused when limit is met', () => {
    let mult = 10;
    let building = new Building({
      effects: [new PlayerEarnResourceEffect({resources: resources, frequency: time})]
    });
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: amount * mult
      }
    });
    player
      .city
      .planBuilding({building: building});

    player.updateTime(1);
    let effect = Object.values(player.city.buildings)[0].effects[0];
    assert.isTrue(effect instanceof PlayerEarnResourceEffect);

    /* Let's speed up the time AFTER we have all the resources we can acumulate */
    player.updateTime(time * mult / 2);
    assert.equal(effect.blocked, false);

    player.updateTime(time * mult / 2 + 1);
    assert.equal(effect.blocked, true);
  });
});
