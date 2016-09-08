const assert = require('chai').assert
const Player = require('../lib/_base/Player.js').Player;
const SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

const MutableObject = require("../lib/_base/utils/Utils.js").MutableObject;

const CityJS = require('../lib/city/City.js')
const City = CityJS.City;

const CityResource = require('../lib/city/CityResource.js').CityResource;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;

const CityPlayerJS = require('../lib/city/CityPlayer.js');
const CityPlayer = CityPlayerJS.CityPlayer;
const PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;

describe('Buildings Effects', () => {
  let resource = CityResource.gold(100);

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
    let city = new City({
      defaultBuilding: building
    });
    let player = new CityPlayer({city:city});
    let multiplier = 4;
    let moreResources = CityResource.resourcesWithMultiplier(resources, multiplier);

    assert.isFalse(player.canAfford(moreResources));
    let updates = player.updateTime(time * (multiplier - 1));
    assert.isFalse(player.canAfford(moreResources));

    updates = player.updateTime(time);
    assert.isTrue(player.canAfford(moreResources));
  });
});
