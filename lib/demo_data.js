const GameController = require('./controller/GameController.js').default;
const GameModule = require('./module/GameModule.js').default;

const CityPlayerJS = require('./city/CityPlayer.js');
const BuildingJS = require('./city/CityBuilding.js');
const CityResourceJS = require('./city/CityResource.js');

const PlayerEarnResourceEffect = CityPlayerJS.PlayerEarnResourceEffect;
const CityPlayer = CityPlayerJS.CityPlayer;
const CityBuilding = BuildingJS.CityBuilding;
const CityResource = CityResourceJS.CityResource;

let controller = GameController.instance;

controller.installCompletedBuilding(GameModule.kBananaTree.namespace);

var demoData = controller.player
module.exports = demoData;
