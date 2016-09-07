var CityPlayerJS = require('./city/CityPlayer.js');
var PlayerJS = require('./_base/Player.js');
var BuildingJS = require('./city/Building.js');
var CityResourceJS = require('./city/CityResource.js');
var SquareCoordinateJS = require('./_base/SquareCoordinate.js');

var PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;
var CityPlayer = CityPlayerJS.CityPlayer;
var Player = PlayerJS.Player;
var Building = BuildingJS.Building;
var CityResource = CityResourceJS.CityResource;
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var CharacterOperationJS = require("./city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;


window.player = new CityPlayer();
player.city.addBuilding({
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
player.city.addBuilding({
  building: new Building({
    name: "Barracks",
    costs: [CityResource.construction(90)],
  }),
  location: new SquareCoordinate(10,0)
});
player.city.addBuilding({
  building: new Building({
    name: "Farm",
    costs: [CityResource.construction(60)],
    generateResources: [CityResource.wood(1)],
    resourcesFrequency: 10,
  }),
  location: new SquareCoordinate(-10,0)
});
player.city.addBuilding({
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
