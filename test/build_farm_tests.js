const assert = require('chai').assert;
const CharacterOperationJS = require("../lib/city/CharacterOperation.js");
const CityJS = require('../lib/city/City.js')

const SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

const GameModule = require('../lib/controller/GameController.js').GameModule;
const CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;
const CityResource = require('../lib/city/CityResource.js').CityResource;

const CityCharacter = CharacterOperationJS.CityCharacter;
const EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;
const InvestResourceInBuildingOperation = CharacterOperationJS.InvestResourceInBuildingOperation;

const City = CityJS.City;

const PlayerEarnResourceEffect = require("../lib/city/CityPlayer.js").PlayerEarnResourceEffect;

describe('Building a wooden farm', () => {
  let time = 10;
  let wood = CityResource.wood(10);
  let resources = [CityResource.food(1)];

  it('requires a character to fetch wood', () => {
    let player = new CityPlayer();
    let character = GameModule.kWoodChopper;
    character = player.addCharacter(character);

    character.setOperationPriority(character.operations[1], 0);
    character.setOperationPriority(character.operations[0], 1);

    let farm = GameModule.kFarm;
    let placedFarmEvent = player.city.planBuilding({
      building:farm,
      location:new SquareCoordinate(-1,0)
    });
    let placedFarm = player.city.buildings[placedFarmEvent.object.id];

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
