var assert = require('chai').assert;
var SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

var CityTestUtilities = require("./utils/common.js").CityTestUtilities;
var CityResource = require('../lib/city/CityResource.js').CityResource;

var CityJS = require('../lib/city/City.js')
var City = CityJS.City;

var CharacterOperationJS = require("../lib/city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;
var InvestResourceInBuildingOperation = CharacterOperationJS.InvestResourceInBuildingOperation;

var BuildingJS = require('../lib/city/Building.js');
var Building = BuildingJS.Building;

describe('Building a farm', () => {
  let time = 10;
  let woodType = CityResource.kResourceWood;
  let wood = CityResource.wood(10);

  it('requires a character to fetch wood', () => {
    let player = CityTestUtilities.enabledCityPlayer(new City(), woodType);
    let operations = [
      new EarnResourceForPlayerOperation({
        time: time,
        resources: [new CityResource(woodType, 1)],
      }),
      new InvestResourceInBuildingOperation({
        time: time
      })
    ];
    let character = new CityCharacter({
      operations:operations
    });
    character.setOperationPriority(operations[1], 0);
    character.setOperationPriority(operations[0], 1);

    player.addCharacter(character);
    let farm = new Building({
      name: "Farm",
      costs: [wood]
    });
    player.city.addBuilding({
      building:farm,
      location:new SquareCoordinate(-1,0)
    });

    /* Half a turn */
    player.updateTime(time/2);
    assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
    /* Middle of next turn */
    player.updateTime(time);
    assert.instanceOf(character.currentOperation, InvestResourceInBuildingOperation);

    /* 10 turns later (1 invest, 1 earn, x 5), I expect half of the farm done. */
    player.updateTime(time * 10);
    assert.strictEqual(farm.progress(), 0.5);

    /* In 10 turns, the building is completed! */
    player.updateTime(time * 10);
    assert.isTrue(farm.isCompleted());

  });
});
