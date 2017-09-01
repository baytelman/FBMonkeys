import {assert} from 'chai';

import {MutableObject} from "../lib/city/utils/Utils.js";

import City from '../lib/city/City.js';
import {CityResource} from '../lib/city/CityResource.js';
import CityBuilding, {CollectBuildingResourcesEffect, BuildingStoreResourceEffect} from '../lib/city/CityBuilding.js';
import {CityPlayer, PlayerEarnResourceEffect} from '../lib/city/CityPlayer.js';
import CityCharacter, {CharacterConsumeResourceOrGetsRemovedEffect} from '../lib/city/CityCharacter.js';
import CityEvent from '../lib/city/CityEvent.js'

describe('Player\'s Characters', () => {

  const kCharacter = 'character';
  const character = (amount) => new CityResource(kCharacter, amount);

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
      [kCharacter]: {
        factory: () => new CityCharacter({name: charName})
      }
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

  it('Have requirements', () => {
    const kCharGold = 'goldChar';
    const kCharWood = 'woodChar';

    let player = new CityPlayer({
      initialCapacity: {
        [kCharGold]: 3,
        [kCharWood]: 3,
        [kGold]: amount * 10,
        [kWood]: amount * 10
      },
      characterFactories: {
        [kCharGold]: {
          requirements: [
            [kGold, amount]
          ],
          factory: () => new CityCharacter({name: kCharGold})
        },
        [kCharWood]: {
          requirements: [
            [kWood, amount]
          ],
          factory: () => new CityCharacter({name: kCharWood})
        }
      }
    })

    /* Character earned the right to 3 characters of each type */
    player.earnResources([new CityResource(kCharGold, 3)]);
    player.earnResources([new CityResource(kCharWood, 3)]);
    /* Only gold characters suffice their requirement */
    let number = 2;
    player.earnResources([new CityResource(kGold, amount * number)]);
    player.updateTime(1);

    let characters = Object.values(player.city.characters);
    assert.equal(number, characters.length);
    assert.isTrue(characters.every(c => c.name == kCharGold));
  });
  
  it('Can enable tasks', () => {
    const player = newPlayer();

    const char1 = Object.values(player.city.characters)[0];

    const task1 = new PlayerEarnResourceEffect({
      resources: [gold(amount)],
      period: time
    });
    const task2 = new PlayerEarnResourceEffect({
      resources: [wood(amount)],
      period: time,
      requirements: [[kGold, amount]]
    });

    assert.isTrue(task1.isAvailable(player));
    assert.isFalse(task2.isAvailable(player));
    
    player.earnResources([
      gold(amount)
    ]);

    assert.isTrue(task1.isAvailable(player));
    assert.isTrue(task2.isAvailable(player));
  });

  it('Can be assigned tasks, rotate as completed', () => {
    const player = newPlayer();
    player.earnResources([character(2)]);
    player.updateTime(1);

    const char1 = Object.values(player.city.characters)[0];

    const task1 = new PlayerEarnResourceEffect({
      resources: [gold(amount)],
      period: time
    });
    const task2 = new PlayerEarnResourceEffect({
      resources: [wood(amount)],
      period: time
    });

    char1.tasks = [task1, task2];
    player.updateTime(1);

    assert.equal(char1.activeTask.originalId, task1.id);
    player.updateTime(time);

    assert.isTrue(player.canAfford([gold(amount)]));
    assert.isFalse(player.canAfford([gold(2 * amount)]));

    assert.equal(char1.activeTask.originalId, task1.id);
    player.updateTime(time);

    assert.isTrue(player.canAfford([gold(2 * amount)]));
    assert.isFalse(player.canAfford([wood(amount)]));
    assert.isNotNull(char1.activeTask);
    assert.equal(char1.activeTask.originalId, task2.id);
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
        [kCharacter]: {
          factory: () => new CityCharacter({name: charName})
        }
      }
    });
    let resource = gold(amount);
    let resources = [resource];

    let storingBuilding = new CityBuilding({
      effects: [new BuildingStoreResourceEffect({resources: resources, period: time})]
    });
    player
      .city
      .planBuilding({building: storingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];

    player.earnResources([character(2)]);
    player.updateTime(1);
    const char1 = Object.values(player.city.characters)[0];

    const collectTask = new CollectBuildingResourcesEffect({period: time});
    char1.tasks = [collectTask];
    player.updateTime(1);

    /* Nothing to pickup */
    assert.isNull(char1.activeTask);
    assert.isFalse(plannedBuilding.getStoredResources());

    /* CityBuilding finished production, picking up */
    player.updateTime(time);
    assert.isNotFalse(plannedBuilding.getStoredResources());
    assert.equal(char1.activeTask.originalId, collectTask.id);

    /* Finished picking up */
    player.updateTime(time);
    assert.isNull(char1.activeTask);
    assert.isFalse(plannedBuilding.getStoredResources());
    assert.isTrue(player.canAfford(resources));
  });

  it('only one character collects from the same building', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kCharacter]: 3,
        [kGold]: 1000
      },
      characterFactories: {
        [kCharacter]: {
          factory: () => new CityCharacter({name: charName})
        }
      }
    });
    let resource = gold(amount);
    let resources = [resource];

    let storingBuilding = new CityBuilding({
      effects: [new BuildingStoreResourceEffect({resources: resources, period: time})]
    });
    player
      .city
      .planBuilding({building: storingBuilding});
    const plannedBuilding = Object.values(player.city.buildings)[0];

    player.earnResources([character(2)]);
    player.updateTime(1);
    const char1 = Object.values(player.city.characters)[0];
    const char2 = Object.values(player.city.characters)[1];

    const collectTask = new CollectBuildingResourcesEffect({period: time});
    char1.tasks = [collectTask];
    char2.tasks = [collectTask];
    player.updateTime(1);

    /* Nothing to pickup */
    assert.isNull(char1.activeTask);
    assert.isNull(char2.activeTask);
    assert.isFalse(plannedBuilding.getStoredResources());

    /* CityBuilding finished production, picking up */
    player.updateTime(time);
    assert.isNotFalse(plannedBuilding.getStoredResources());
    assert.equal(char1.activeTask.originalId, collectTask.id);
    assert.isNull(char2.activeTask);
  });

  it('collection can be limited to a specific building', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kCharacter]: 3,
        [kWood]: 1000,
        [kGold]: 1000
      },
      characterFactories: {
        [kCharacter]: {
          factory: () => new CityCharacter({name: charName})
        }
      }
    });
    let resource = gold(amount);
    let resources = [resource];

    let woodBuilding = new CityBuilding({
      namespace: 'b1',
      effects: [new BuildingStoreResourceEffect({resources: [wood(10)], period: time})]
    });
    let goldBuilding = new CityBuilding({
      namespace: 'b2',
      effects: [new BuildingStoreResourceEffect({resources: [gold(10)], period: time})]
    });
    let anotherBuilding = new CityBuilding({
      namespace: 'b3',
      effects: [new BuildingStoreResourceEffect({resources: [gold(10)], period: time})]
    });
    player
    .city
    .planBuilding({building: woodBuilding});
    player
    .city
    .planBuilding({building: goldBuilding});
    player
    .city
    .planBuilding({building: anotherBuilding});
    const plannedBuilding1 = Object.values(player.city.buildings)[0];
    const plannedBuilding2 = Object.values(player.city.buildings)[1];
    const plannedBuilding3 = Object.values(player.city.buildings)[2];
    
    player.earnResources([character(3)]);
    player.updateTime(1);
    const char1 = Object.values(player.city.characters)[0];
    const char2 = Object.values(player.city.characters)[1];
    const char3 = Object.values(player.city.characters)[2];
    
    char1.tasks = [new CollectBuildingResourcesEffect({
      period: time,
      allowedBuildings: [plannedBuilding1.namespace]
    })];
    char2.tasks = [new CollectBuildingResourcesEffect({
      period: time,
      allowedBuildings: [plannedBuilding2.namespace]
    })];
    char3.tasks = [new CollectBuildingResourcesEffect({
      period: time,
      allowedBuildings: ['a.different.namespace']
    })];
    player.updateTime(1);

    /* Nothing to pickup */
    assert.isNull(char1.activeTask);
    assert.isNull(char2.activeTask);
    assert.isNull(char3.activeTask);
    assert.isFalse(plannedBuilding1.getStoredResources());
    assert.isFalse(plannedBuilding2.getStoredResources());
    assert.isFalse(plannedBuilding3.getStoredResources());
    
    /* CityBuilding finished production, picking up */
    player.updateTime(time);
    assert.isNotFalse(plannedBuilding1.getStoredResources());
    assert.isNotFalse(plannedBuilding2.getStoredResources());
    assert.isNotFalse(plannedBuilding3.getStoredResources());

    assert.equal(char1.activeTask.building, plannedBuilding1);
    assert.equal(char2.activeTask.building, plannedBuilding2);
    assert.isNull(char3.activeTask);
  });

  it('Can consume resources', () => {
    const initialAmount = 5;
    const amountNeeded = 1;
    const period = 3;
    const characters = 2;

    const player = new CityPlayer({
      initialCapacity: {
        [kCharacter]: characters,
        [kGold]: initialAmount
      },
      characterFactories: {
        [kCharacter]: {
          factory: () => new CityCharacter({
            name: charName,
            effects: [new CharacterConsumeResourceOrGetsRemovedEffect({
                resources: [gold(amountNeeded)],
                period: period
              })]
          })
        }
      }
    });

    player.earnResources([gold(initialAmount), character(characters)]);
    player.updateTime(1);
    assert.equal(characters, Object.values(player.city.characters).length);

    let events1 = player.updateTime(period);
    assert.equal(characters, events1.length);
    assert.isTrue(events1.every(e => e.type == CityEvent.kSpendResourceEvent));

    assert.equal(player.getResourceAmountForType(kGold), initialAmount - characters * amountNeeded);
  });

  it('Can die', () => {
    const amountNeeded = 1;
    const period = 3;
    const times = 5;

    const player = new CityPlayer({
      initialCapacity: {
        [kCharacter]: 1,
        [kGold]: amountNeeded * times
      },
      characterFactories: {
        [kCharacter]: {
          requirements: [
            [kGold, amountNeeded]
          ],
          factory: () => new CityCharacter({
            name: charName,
            effects: [new CharacterConsumeResourceOrGetsRemovedEffect({
                resources: [gold(amountNeeded)],
                period: period
              })]
          })
        }
      }
    });

    player.earnResources([
      gold(amountNeeded * times),
      character(1)
    ]);
    player.updateTime(1);

    let events1 = player.updateTime(period * times);
    assert.equal(times, events1.length);
    assert.isTrue(events1.every(e => e.type == CityEvent.kSpendResourceEvent));
    assert.equal(player.getResourceAmountForType(kGold), 0);

    let events2 = player.updateTime(period);
    assert.equal(1, events2.length);
    assert.equal(events2[0].type, CityEvent.kCharacterRemovedEvent);
    assert.equal(0, Object.values(player.city.characters).length);
  });

});
