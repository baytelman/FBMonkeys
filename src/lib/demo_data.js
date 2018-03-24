import GameController from './controller/GameController';
import GameModule from './module/GameModule';

let controller = GameController.instance;
const setup = () => {
  GameModule
    .kDefaultBuildings
    .forEach(namespace => {
      controller.installCompletedBuilding(namespace);
    })
}

export default setup;
