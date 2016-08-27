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

let player = new CityPlayer();
player.city.addBuilding({
  building: new Building({
    name: "Gold Mine",
    buildTime: 120,
    generateResources: [CityResource.gold(1)],
    resourcesFrequency: 3,
  }),
  location: new SquareCoordinate(0,-1)
});
player.city.addBuilding({
  building: new Building({
    name: "Barracks",
    buildTime: 90
  }),
  location: new SquareCoordinate(1,0)
});
player.city.addBuilding({
  building: new Building({
    name: "Farm",
    buildTime: 60,
    generateResources: [CityResource.human(1)],
    resourcesFrequency: 10,
  }),
  location: new SquareCoordinate(-1,0)
});
player.city.addBuilding({
  building: new Building({
    name: "Beerracks",
    buildTime: 60,
    generateResources: [CityResource.human(1)],
    resourcesFrequency: 10,
  }),
  location: new SquareCoordinate(0,1)
});

var demoData = player
module.exports = demoData;
