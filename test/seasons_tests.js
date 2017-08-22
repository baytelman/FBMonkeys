import {assert} from 'chai';

import {CityResource} from '../lib/city/CityResource.js';
import {CityPlayer} from '../lib/city/CityPlayer.js';
import CityBuilding, {CollectBuildingResourcesEffect, BuildingStoreResourceEffect, ResourceStoringModifierEffect} from '../lib/city/CityBuilding.js';
import {CityCharacter, CharacterConsumeResourceOrGetsRemovedEffect } from '../lib/city/CityCharacter.js';

describe('City\'s seasons', () => {

  const kCharacter = 'character';
  const character = (amount) => new CityResource(kCharacter, amount);

  const kGold = 'gold';
  const gold = (amount) => new CityResource(kGold, amount);

  let seasonPeriod = 20;
  const newPlayer = () => new CityPlayer({
    initialCapacity: {
      [kCharacter]: 1,
      [kGold]: 100000
    },
    characterFactories: {
      [kCharacter]: {
        factory: () => new CityCharacter({})
      }
    },
    seasonPeriod: seasonPeriod,
    seasonAffectedResource: kGold
  });

  it('Seasons and year pass', () => {
    let player = newPlayer();

    player.updateTime(seasonPeriod / 2);
    assert.equal(0, player.city.currentYear);
    assert.equal(0, player.city.currentSeason);

    player.updateTime(seasonPeriod);
    assert.equal(0, player.city.currentYear);
    assert.equal(1, player.city.currentSeason);

    player.updateTime(seasonPeriod * 5);
    assert.equal(1, player.city.currentYear);
    assert.equal(2, player.city.currentSeason);
  });

  it('Seasons have effects', () => {
    let player = newPlayer();
    player.updateTime(seasonPeriod / 2);
    let effect0 = player.city.seasonPermanentEffect;
    assert.isNotNull(effect0)
    assert.isTrue(effect0 instanceof ResourceStoringModifierEffect)
  });

  it('Seasons can affect storage', () => {
    let player = newPlayer();

    const amount = 2;
    let resource = gold(amount);
    let resources = [resource];
    let time = 1;

    let storingBuilding = new CityBuilding({
      effects: [new BuildingStoreResourceEffect({resources: resources, period: time})]
    });
    player
      .city
      .planBuilding({building: storingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];

    player.earnResources([character(1)]);
    player.updateTime(0.1);
    const char1 = Object.values(player.city.characters)[0];

    const collectTask = new CollectBuildingResourcesEffect({period: time});
    char1.tasks = [collectTask];
    player.updateTime(0.1);

    player.updateTime(seasonPeriod);
    let seasonSpring = player.getResourceAmountForType(kGold)

    player.updateTime(seasonPeriod);
    let seasonSummer = player.getResourceAmountForType(kGold)

    player.updateTime(seasonPeriod);
    let seasonFall = player.getResourceAmountForType(kGold)

    player.updateTime(seasonPeriod);
    let seasonWinter = player.getResourceAmountForType(kGold)

    assert.isAbove(seasonSpring, seasonSummer - seasonSpring)
    assert.isAbove(seasonSummer - seasonSpring, seasonFall - seasonSummer)
    assert.isAbove(seasonFall - seasonSummer, seasonWinter - seasonFall)
  });
});
