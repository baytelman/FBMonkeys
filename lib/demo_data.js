const GameModule = require('../lib/controller/GameController.js').GameModule;

const CityPlayerJS = require('./city/CityPlayer.js');
const PlayerJS = require('./_base/Player.js');
const BuildingJS = require('./city/Building.js');
const CityResourceJS = require('./city/CityResource.js');
const SquareCoordinateJS = require('./_base/SquareCoordinate.js');

const PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;
const CityPlayer = CityPlayerJS.CityPlayer;
const Player = PlayerJS.Player;
const Building = BuildingJS.Building;
const CityResource = CityResourceJS.CityResource;
const SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

const CharacterOperationJS = require("./city/CharacterOperation.js");
const CityCharacter = CharacterOperationJS.CityCharacter;
const CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

window.player = new CityPlayer();
player.city.planBuilding({
  building: new Building({
    name: "Gold Mine",
    costs: [CityResource.construction(120)],
    effects: [new PlayerEarnResourceEffect({
      resources:[CityResource.gold(1)],
      frequency: 3
    })]
  }),
  location: new SquareCoordinate(0,-10)
});
player.city.planBuilding({
  building: new Building({
    name: "Barracks",
    costs: [CityResource.construction(90)],
  }),
  location: new SquareCoordinate(10,0)
});
player.city.planBuilding({
  building: GameModule.kFarm,
  location: new SquareCoordinate(-10,0)
});
player.city.planBuilding({
  building: new Building({
    name: "Woodmill",
    costs: [CityResource.construction(60)],
    effects: [new PlayerEarnResourceEffect({
      resources:[CityResource.wood(1)],
      frequency: 10
    })]
  }),
  location: new SquareCoordinate(0,10)
});
player.addCharacter(new CityCharacter({
  operations: [new CompleteBuildingOperation({ amount: 3 })]
}));

var demoData = player
module.exports = demoData;
