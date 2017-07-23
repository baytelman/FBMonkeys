const assert = require('chai').assert

const MutableObject = require("../lib/city/utils/Utils.js").MutableObject;

const City = require('../lib/city/City.js').default;

const CityResource = require('../lib/city/CityResource.js').CityResource;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;

const CityPlayerJS = require('../lib/city/CityPlayer.js');
const CityPlayer = CityPlayerJS.default;
const PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;

const kGold = 'gold';
const gold = (amount) => new CityResource(kGold, amount);

describe('Buildings Effects', () => {
  let resource = gold(100);

  it('can grant resources', () => {
    let resources = [resource];
    let time = 10;
    let building = new Building({
      effects:[
        new PlayerEarnResourceEffect({
          resources:resources,
          frequency:time
        })
      ],
    });
    let player = new CityPlayer({
			initialCapacity: {
				[kGold]: 1000
			}
		});
    player.city.planBuilding({
      building: building
    });
    let multiplier = 4;
    let moreResources = CityResource.resourcesWithMultiplier(resources, multiplier);

    assert.isFalse(player.canAfford(moreResources));
    let updates = player.updateTime(time * (multiplier - 1));
    assert.isFalse(player.canAfford(moreResources));

    updates = player.updateTime(time);
    assert.isTrue(player.canAfford(moreResources));

		const b = Object.values(player.city.buildings)[0];
		assert.include(b.toString(), 'Producing');
		assert.include(b.effects[0].toString(), 'Producing');
  });
});
