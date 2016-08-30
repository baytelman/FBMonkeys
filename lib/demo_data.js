var CityPlayerJS = require('./city/CityPlayer.js');
var PlayerJS = require('./_base/Player.js');
var BuildingJS = require('./city/Building.js');
var CityResourceJS = require('./city/CityResource.js');
var SquareCoordinateJS = require('./_base/SquareCoordinate.js');

var CityPlayer = CityPlayerJS.CityPlayer;
var Player = PlayerJS.Player;
var Building = BuildingJS.Building;
var CityResource = CityResourceJS.CityResource;
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var CharacterOperationJS = require("../lib/city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

let player = new CityPlayer();
player.city.addBuilding({
  building: new Building({
    name: "Gold Mine",
    costs: [CityResource.construction(120)],
    generateResources: [CityResource.gold(1)],
    resourcesFrequency: 3,
  }),
  location: new SquareCoordinate(0,-1)
});
player.city.addBuilding({
  building: new Building({
    name: "Barracks",
    costs: [CityResource.construction(90)],
  }),
  location: new SquareCoordinate(1,0)
});
player.city.addBuilding({
  building: new Building({
    name: "Farm",
    costs: [CityResource.construction(60)],
    resourcesFrequency: 10,
  }),
  location: new SquareCoordinate(-1,0)
});
player.city.addBuilding({
  building: new Building({
    name: "Tavern",
    costs: [CityResource.construction(60)],
    resourcesFrequency: 10,
  }),
  location: new SquareCoordinate(0,1)
});
player.addCharacter(new CityCharacter({
  operations: [new CompleteBuildingOperation({ amount: 3 })]
}));

var demoData = player
module.exports = demoData;
