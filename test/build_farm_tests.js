var assert = require('chai').assert;
var SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

var GameModule = require('../lib/controller/GameController.js').GameModule;
var CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;
var CityResource = require('../lib/city/CityResource.js').CityResource;

var CityJS = require('../lib/city/City.js')
var City = CityJS.City;

var CharacterOperationJS = require("../lib/city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;
var InvestResourceInBuildingOperation = CharacterOperationJS.InvestResourceInBuildingOperation;
var PlayerEarnResourceEffect = require("../lib/city/CityPlayer.js").PlayerEarnResourceEffect;

var BuildingJS = require('../lib/city/Building.js');
var Building = BuildingJS.Building;

describe('Building a wooden farm', () => {
  let time = 10;
  let wood = CityResource.wood(10);
  let resources = [CityResource.food(1)];

  it('requires a character to fetch wood', () => {
    let player = new CityPlayer();
    let operations = [
      new EarnResourceForPlayerOperation({
        time: time,
        resources: [new CityResource(CityResource.kResourceWood, 1)],
      }),
      new InvestResourceInBuildingOperation({
        time: time,
      })
    ];
    let character = new CityCharacter({
      operations:operations
    });
    character.setOperationPriority(operations[1], 0);
    character.setOperationPriority(operations[0], 1);

    player.addCharacter(character);
    let farm = GameModule.kFarm;
    player.city.addBuilding({
      building:farm,
      location:new SquareCoordinate(-1,0)
    });

    let placedFarm = player.city.buildings[1];

    /* Half a turn */
    player.updateTime(time/2);
    assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
    /* Middle of next turn */
    player.updateTime(time);
    assert.instanceOf(character.currentOperation, InvestResourceInBuildingOperation);

    /* 10 turns later (1 invest, 1 earn, x 5), I expect half of the farm done. */
    player.updateTime(time * 10);
    assert.strictEqual(placedFarm.progress(), 0.5);

    /* In 10 turns, the building is completed! */
    assert.isFalse(player.canAfford(resources));
    let updates = player.updateTime(time * 9);
    assert.isTrue(placedFarm.isCompleted());

    /* In 10 turns, the player can afford 1 food */
    assert.isFalse(player.canAfford(resources));
    assert.instanceOf(placedFarm.effects[0], PlayerEarnResourceEffect);
    updates = player.updateTime(time * 10);
    assert.isTrue(player.canAfford(resources));

  });
});
