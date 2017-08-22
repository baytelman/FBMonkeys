import {assert} from 'chai';

import CityProject from '../lib/city/CityProject.js';
import CityBuilding, {BuildingStoreResourceEffect, CollectBuildingResourcesEffect} from '../lib/city/CityBuilding.js';
import CitySerializer from "../lib/city/CitySerializer.js";

import {CityPlayer} from '../lib/city/CityPlayer.js';
import {PlayerEarnResourceEffect} from '../lib/city/CityPlayer.js';
import {CityResource} from '../lib/city/CityResource.js';
import {CityCharacter} from '../lib/city/CityCharacter.js';
import City from '../lib/city/City.js';

const kGold = 'gold';
const gold = (amount) => new CityResource(kGold, amount);
const kCharacter = 'character';
const character = (amount) => new CityResource(kCharacter, amount);

describe('Serialization', () => {
  let time = 10;
  let totalTime = 100;

  const amount = 100;
  let resource = gold(amount);
  let resources = [resource];

  it('Deserialized player continues building', () => {
    let construction = 10;
    let building = new CityBuilding({
      time: totalTime,
      effects: [
        new PlayerEarnResourceEffect({resources: resources, period: time}),
        new BuildingStoreResourceEffect({resources: resources, period: time})
      ]
    });

    let player = new CityPlayer({
      seasonPeriod: 1,
      seasonAffectedResource: kGold,
      characterFactories: {
        [kCharacter]: {
          factory: () => new CityCharacter({
            name: 'Character',
            tasks: [new CollectBuildingResourcesEffect({period: time})]
          })
        }
      }
    });
    player
      .city
      .planBuilding({building: building});
    player.earnResources([character(1)]);

    let updates = player.updateTime(time);

    let b = Object.values(player.city.buildings)[0];
    assert.closeTo(b.progress(), 0.1, 0.01);

    let json = CitySerializer.serialize(player);
    assert.include(json, player.id);
    player = CitySerializer.deserialize(json);

    updates = player.updateTime(time);
    assert.isTrue(updates.length > 0);
    b = Object.values(player.city.buildings)[0];
    assert.closeTo(b.progress(), 0.2, 0.01);

    updates = player.updateTime(time);
  });

  it('Can deserialize recursive references', () => {
    let b = {
      id: 'b',
      name: 'nameB'
    };
    let c = {
      id: 'c',
      name: 'nameC'
    };
    let a = {
      id: 'a',
      name: 'nameA',
      children: [
        b, c
      ],
      favoriteChild: b
    };
    b.myself = b;
    b.mom = a;
    c.friend = a;

    let json = CitySerializer.serialize(a);
    let deserializedA = CitySerializer.deserialize(json);

    assert.equal('nameA', a.children[0].myself.mom.name);
    assert.equal('nameA', a.children[1].friend.name);

    var countA = (json.match(/nameA/g) || []).length;
    var countB = (json.match(/nameB/g) || []).length;
    var countC = (json.match(/nameC/g) || []).length;

    assert.equal(1, countA);
    assert.equal(1, countB);
    assert.equal(1, countC);
  });

  it('Cannot deserialize unknown class', () => {
    class UnknownClass {
      constructor() {
        this.name = 'unknownClass';
        this.id = 123;
      }
    }

    let json = CitySerializer.serialize(new UnknownClass());
    assert.throw(() => CitySerializer.deserialize(json), Error);
  });
});
