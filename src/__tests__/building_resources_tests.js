import { assert } from 'chai';
import CityBuilding, {
  BuildingStoreResourceEffect
} from '../controller/CityBuilding.js';
import { kActionAbortedEvent } from '../controller/CityEvent';
import CityPlayer, {
  PlayerEarnResourceEffect
} from '../controller/CityPlayer.js';
import { CityResource } from '../controller/CityResource.js';
import { SpeedEnhancementEffect } from '../controller/Effect.js';

const kGold = 'gold';
const gold = amount => new CityResource(kGold, amount);
const amount = 100;

describe('Buildings Effects', () => {
  let resource = gold(amount);
  let resources = [resource];
  let time = 10;
  let grantingBuilding = new CityBuilding({
    namespace: 'grantingBuilding',
    periodicEffects: [
      new PlayerEarnResourceEffect({ resources: resources, period: time })
    ]
  });

  let storingBuilding = new CityBuilding({
    periodicEffects: [
      new BuildingStoreResourceEffect({ resources: resources, period: time })
    ]
  });

  it('can grant resources to player', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: 1000
      }
    });
    player.city.planBuilding({ building: grantingBuilding });
    const plannedBuilding = Object.values(player.city.buildings)[0];
    assert.isFalse(plannedBuilding.getStoredResources());

    let multiplier = 4;
    let moreResources = CityResource.resourcesWithMultiplier(
      resources,
      multiplier
    );

    assert.isFalse(player.canAfford(moreResources));
    let updates = player.updateTime(time * (multiplier - 1));
    assert.isFalse(player.canAfford(moreResources));

    updates = player.updateTime(time);
    assert.isTrue(player.canAfford(moreResources));

    assert.isFalse(plannedBuilding.getStoredResources());
    assert.include(plannedBuilding.toString(), 'Producing');
    assert.include(plannedBuilding.periodicEffects[0].toString(), 'Producing');
  });

  it('can store resources in building', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: 1000
      }
    });
    player.city.planBuilding({ building: storingBuilding });
    const plannedBuilding = Object.values(player.city.buildings)[0];
    assert.isFalse(plannedBuilding.getStoredResources());

    assert.isFalse(player.canAfford(resources));
    player.updateTime(time + 1);
    const effect = plannedBuilding.periodicEffects[0];

    /* Player has NOT earned the resources yet, but they are ready to be collected */
    assert.isFalse(player.canAfford(resources));
    assert.isNotFalse(plannedBuilding.getStoredResources());

    player.updateTime(1);
    assert.equal(effect.blocked, 'Already is storing resources');

    plannedBuilding.collectResources(player);
    assert.isTrue(player.canAfford(resources));

    player.updateTime(1);
    assert.equal(effect.blocked, false);

    assert.isFalse(plannedBuilding.getStoredResources());
    assert.include(plannedBuilding.toString(), 'Producing');
    assert.include(plannedBuilding.periodicEffects[0].toString(), 'Producing');
  });

  it('pause granting when capacity is full', () => {
    let mult = 10;
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: amount * mult
      }
    });
    player.city.planBuilding({ building: grantingBuilding });

    player.updateTime(1);
    const effect = Object.values(player.city.buildings)[0].periodicEffects[0];
    assert.isTrue(effect instanceof PlayerEarnResourceEffect);

    /* Let's speed up the time AFTER we have all the resources we can acumulate */
    player.updateTime((time * mult) / 2);
    assert.equal(effect.blocked, false);

    player.updateTime((time * mult) / 2 + 1);
    assert.equal(effect.blocked, 'No capacity left');
  });

  it('pause production while storage is full', () => {
    let mult = 10;
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: amount
      }
    });
    player.city.planBuilding({ building: storingBuilding });
    const plannedBuilding = Object.values(player.city.buildings)[0];

    player.updateTime(1);
    let effect = plannedBuilding.periodicEffects[0];
    assert.isTrue(effect instanceof BuildingStoreResourceEffect);

    /* Let's speed up the time AFTER we have all the resources we can acumulate */
    player.updateTime(time / 2);
    assert.equal(effect.blocked, false);

    player.updateTime(time / 2 + 1);
    assert.equal(effect.blocked, 'Already is storing resources');

    plannedBuilding.collectResources(player);
    player.updateTime(1);

    /* Still blocked – Player cannot earn more */
    assert.equal(effect.blocked, false);
  });

  it('cannot be collected if capacity is full', () => {
    let mult = 10;
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: amount
      }
    });
    player.city.planBuilding({ building: storingBuilding });
    const plannedBuilding = Object.values(player.city.buildings)[0];

    /* It can collect */
    player.updateTime(time + 1);
    assert.equal(true, plannedBuilding.canCollectResources(player));
    plannedBuilding.collectResources(player);

    /* It should not be able to collect */
    player.updateTime(time + 1);
    assert.equal(false, plannedBuilding.canCollectResources(player));
    assert.equal(
      plannedBuilding.collectResources(player).type,
      kActionAbortedEvent
    );
  });

  it('granting speed is influenced by effecsy', () => {
    let player1 = new CityPlayer({
        initialCapacity: {
          [kGold]: 1000
        }
      }),
      player2 = new CityPlayer({
        initialCapacity: {
          [kGold]: 1000
        }
      });

    /* Player 1 produces at regular speed */
    player1.city.planBuilding({ building: grantingBuilding });
    /* Player 2 produces faster due to effect */
    player2.city.planBuilding({ building: grantingBuilding });

    let enhancement = 0.5;
    player2.city.planBuilding({
      building: new CityBuilding({
        permanentEffects: [
          new SpeedEnhancementEffect({
            namespaces: [grantingBuilding.namespace],
            enhancement: enhancement
          })
        ]
      })
    });

    let cycles = 4;
    player1.updateTime(time * cycles);
    player2.updateTime(time * cycles);

    assert.equal(player1.getResourceAmountForType(kGold), amount * cycles);
    assert.equal(
      player2.getResourceAmountForType(kGold),
      amount * cycles * (1 + enhancement)
    );
  });
});
