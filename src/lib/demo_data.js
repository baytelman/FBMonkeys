import GameController  from './controller/GameController';
import GameModule  from './module/GameModule';

import {PlayerEarnResourceEffect, CityPlayer}  from './city/CityPlayer'
import {CityBuilding}  from './city/CityBuilding'
import {CityResource}  from './city/CityResource'

let controller = GameController.instance;

GameModule.kDefaultBuildings.forEach(namespace => {
    controller.installCompletedBuilding(namespace);
});

const demoData = controller.player
export default demoData;
