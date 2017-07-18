const GameController = require('../lib/controller/GameController.js').default;
const GameModule = require('../lib/module/GameModule.js').default;

const CityPlayerJS = require('./city/CityPlayer.js');
const PlayerJS = require('./_base/Player.js');
const BuildingJS = require('./city/Building.js');
const CityResourceJS = require('./city/CityResource.js');

const PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;
const CityPlayer = CityPlayerJS.CityPlayer;
const Player = PlayerJS.Player;
const Building = BuildingJS.Building;
const CityResource = CityResourceJS.CityResource;

let controller = GameController.instance;

controller.installCompletedBuilding(GameModule.kCityHall.id);
controller.installCompletedBuilding(GameModule.kGoldMine.id);
controller.installCompletedBuilding(GameModule.kFarm.id);
controller.installCompletedBuilding(GameModule.kLumberMill.id);

var demoData = controller.player
module.exports = demoData;
