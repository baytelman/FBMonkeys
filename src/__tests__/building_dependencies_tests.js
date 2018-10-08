import {assert} from 'chai'

import {CityResource} from '../controller/CityResource';
import CityBuilding, {BuildingConstructionAction} from '../controller/CityBuilding';
import CityPlayer from '../controller/CityPlayer';

const kGold = 'gold';
const gold = (amount) => new CityResource(kGold, amount);

describe('Buildings Dependencies', () => {
  let resource = gold(100);

  it('can be resources', () => {
    let resources = [resource];
    let time = 10;
    let building = new CityBuilding({
      requirements: [
        [kGold, 5]
      ]
    });
    let player = new CityPlayer({
      initialCapacity: {
        [kGold]: 100
      }
    });

    let action = new BuildingConstructionAction({building: building});
    player.updateTime(1);
    assert.isFalse(action.isAvailable(player));

    player.earnResources([gold(1)]);
    assert.isFalse(action.isAvailable(player));

    player.earnResources([gold(5)]);
    assert.isTrue(action.isAvailable(player));
  });

  it('can be buildings', () => {
    let building1 = new CityBuilding();
    let building2 = new CityBuilding({
      requirements: [building1.namespace]
    });
    let player = new CityPlayer();

    let action = new BuildingConstructionAction({building: building2});
    assert.isFalse(action.isAvailable(player));

    player
      .city
      .planBuilding({building: building1});

    player.updateTime(building1.setupTime);
    assert.isTrue(action.isAvailable(player));
  });

  it('can require multiple of same', () => {
    let building1 = new CityBuilding();
    let building2 = new CityBuilding({
      requirements: [
        [building1.namespace, 2]
      ]
    });
    let player = new CityPlayer();

    let action = new BuildingConstructionAction({building: building2});
    assert.isFalse(action.isAvailable(player));

    /* First one, not enough */
    player
      .city
      .planBuilding({building: building1});
    player.updateTime(building1.setupTime);
    assert.isFalse(action.isAvailable(player));

    /* Second one, not enough */
    player
      .city
      .planBuilding({building: building1});
    player.updateTime(building1.setupTime);
    assert.isTrue(action.isAvailable(player));
  });

  it('once are unlocked, they stay, even if the requiremens become unmeant', () => {
    let building1 = new CityBuilding();
    let building2 = new CityBuilding({
      namespace: 'abc',
      requirements: [building1.namespace]
    });
    let building3 = new CityBuilding({
      namespace: 'def',
      requirements: [building1.namespace]
    });
    let player = new CityPlayer();

    let action2 = new BuildingConstructionAction({building: building2});
    player
      .city
      .planBuilding({building: building1});

    player.updateTime(building1.setupTime);
    assert.isTrue(action2.isAvailable(player));

    player.city.buildings = {};
    player.updateTime(1);
    assert.isTrue(action2.isAvailable(player));

    /* Action3 was never evaluated, hence the system never unlocked id. */
    /* Even it has the same requirements than Action2, it should still be unavailable */
    let action3 = new BuildingConstructionAction({building: building3});
    assert.isFalse(action3.isAvailable(player));
  });
});
