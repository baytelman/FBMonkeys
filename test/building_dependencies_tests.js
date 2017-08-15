import {assert} from 'chai'
import {CityResource} from '../lib/city/CityResource';
import {Building, BuildingConstructionAction} from '../lib/city/Building';
import {CityPlayer} from '../lib/city/CityPlayer';

const gold = (amount) => new CityResource('gold', amount);

describe('Buildings Dependencies', () => {
  let resource = gold(100);

  it('can become available', () => {
    let resources = [resource];
    let time = 10;
    let building1 = new Building();
    let building2 = new Building({
      requirements: [building1.namespace]
    });
    let player = new CityPlayer();

    let action = new BuildingConstructionAction({building: building2});
    assert.isFalse(action.isAvailable(player));

    player
      .city
      .planBuilding({building: building1});

    player.updateTime(building1.buildingTime);
    assert.isTrue(action.isAvailable(player));
  });

  it('can require multiple of same', () => {
    let resources = [resource];
    let time = 10;
    let building1 = new Building();
    let building2 = new Building({
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
    player.updateTime(building1.buildingTime);
    assert.isFalse(action.isAvailable(player));

    /* Second one, not enough */
    player
      .city
      .planBuilding({building: building1});
    player.updateTime(building1.buildingTime);
    assert.isTrue(action.isAvailable(player));
  });

  it('once are unlocked, they stay, even if the requiremens become unmeant', () => {
    let resources = [resource];
    let time = 10;
    let building1 = new Building();
    let building2 = new Building({
      namespace: 'abc',
      requirements: [building1.namespace]
    });
    let building3 = new Building({
      namespace: 'def',
      requirements: [building1.namespace]
    });
    let player = new CityPlayer();

    let action2 = new BuildingConstructionAction({building: building2});
    player
      .city
      .planBuilding({building: building1});

    player.updateTime(building1.buildingTime);
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
