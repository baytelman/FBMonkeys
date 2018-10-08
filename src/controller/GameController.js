import PropTypes from 'prop-types';

import GameModule from './GameModule';

import CityEvent, {
  kAvailableAreasChangedEvent,
  kAvailableBuildingsChangedEvent,
  kAvailableResearchChangedEvent
} from './CityEvent';
import CityPlayer from './CityPlayer';
import { UnavailableActionError } from './CityResource';
import { Square } from './utils/Utils';
import CityBuilding, { BuildingConstructionAction } from './CityBuilding';
import { ScheduleResearchProjectAction } from './CityResearchProject';

const Geom = Square;

export default class GameController {
  time = 0;
  availableAreas = [{ x: 0, y: 0 }];
  availableBuildings = [];

  constructor({ onUpdate } = {}) {
    this.module = new GameModule();
    this.onUpdate = onUpdate || (() => {});
    setTimeout(this.startNewGame, 1);
  }

  startNewGame = ({ defaultBuildings = GameModule.kDefaultBuildings } = {}) => {
    this.loadPlayer(new CityPlayer());

    defaultBuildings.map(blueprint =>
      this.planBuildingWithoutResouceConsumption({
        ...blueprint,
        complete: true
      })
    );
  };

  loadPlayer(player) {
    if (!this.player) {
      this.player = new CityPlayer();
    }
    Object.assign(this.player, player);
    this.player.characterFactories = this.module.getCharacterFactories();
    this.player.initialCapacity = this.module.getPlayerInitialCapacity();
  }

  _processEvents(events) {
    if (events.some(e => e.mayChangePlayerFullfilments())) {
      events = events.concat(this.getAvailabilityChanges());
    }
    this.onUpdate(events);
    return events;
  }

  getInitialEvents() {
    this.availableBuildings = this.availableResearch = null;
    return this.getAvailabilityChanges();
  }
  getAvailabilityChanges() {
    const events = [];
    let bldngs = this.calculateAvailableBuildings();
    if (JSON.stringify(bldngs) !== JSON.stringify(this.availableBuildings)) {
      this.availableBuildings = bldngs;
      events.push(
        new CityEvent({
          type: kAvailableBuildingsChangedEvent,
          data: { availableBuildings: this.availableBuildings }
        })
      );
    }
    let availableResearch = this.calculateAvailableResearch();
    if (JSON.stringify(availableResearch) !== JSON.stringify(this.availableResearch)) {
      this.availableResearch = availableResearch;
      events.push(
        new CityEvent({
          type: kAvailableResearchChangedEvent,
          data: {
            researchedProjects: this.player.researchedProjects,
            researchProjects: this.player.researchProjects,
            availableResearch: this.availableResearch
          }
        })
      );
    }
    return events;
  }

  updateTime(deltaSeconds) {
    let events = this.player.updateTime(deltaSeconds);
    if (events.some(e => e.changesSpotsAvailability())) {
      events.push(this.updateAvailableAreas());
    }
    this._processEvents(events);
    return events;
  }

  planBuildingWithoutResouceConsumption({ namespace, x, y, complete }) {
    let b = this.module.allBuildings()[namespace];
    if (!b) {
      throw new UnavailableActionError(
        `Unknown building: ${namespace} (${Object.keys(this.module.allBuildings()).join(', ')})`
      );
    }
    let events = [
      this.player.city.planBuilding({ building: b, x, y, complete }),
      this.updateAvailableAreas()
    ];
    this._processEvents(events);
    return events;
  }

  planBuilding({ namespace, x, y }) {
    let b = this.module.allBuildings()[namespace];
    if (!b) {
      throw new UnavailableActionError();
    }
    const action = new BuildingConstructionAction({ building: b, x, y });
    action.executeForPlayer(this.player);
    let events = [this.updateAvailableAreas()];
    this._processEvents(events);
    return events;
  }

  installCompletedBuilding(namespace) {
    return this.planBuildingWithoutResouceConsumption({
      namespace,
      complete: true
    });
  }

  collectFromBuilding(buildingId) {
    return this._processEvents([
      this.player.city.buildings[buildingId].collectResources(this.player)
    ]);
  }

  updateAvailableAreas = () => {
    let availableAreas = [];
    for (let building of this.player.city.getCompletedBuildings()) {
      availableAreas = availableAreas.concat(Geom.neightbors(building));
    }
    let usedAreas = this.player.city.getAllBuildings();
    this.availableAreas = Geom.remove(Geom.dedup(availableAreas), usedAreas);

    return new CityEvent({
      type: kAvailableAreasChangedEvent,
      data: { availableAreas: this.availableAreas }
    });
  };

  calculateAvailableBuildings = () => {
    return Object.values(GameModule.kAvailableBuildings)
      .filter(b => this.player.fulfillsRequirements(b.namespace, b.requirements))
      .sort(CityBuilding.compare);
  };

  calculateAvailableResearch = () => {
    return Object.values(this.module.allResearch()).filter(project =>
      new ScheduleResearchProjectAction({ project: project }).isAvailable(this.player)
    );
  };

  setCharacterTasks(id, taskNamespaces) {
    let character = this.player.city.characters[id];
    if (!character) {
      throw new UnavailableActionError();
    }
    let tasks = taskNamespaces.map(n => this.module.availableTasks()[n]);
    return this._processEvents([character.setTasks(tasks)]);
  }

  getAllMyBuilding = () => {
    return this.player.city.buildings;
  };

  getBuilding(id) {
    return this.player.city.buildings[id];
  }

  scheduleResearch(namespace) {
    let research = this.module.allResearch()[namespace];
    if (!research) {
      throw new UnavailableActionError();
    }
    let event = this.player.scheduleResearch(research);
    return this._processEvents([event]);
  }
}

GameController.propTypes = {
  onUpdate: PropTypes.func.isRequired
};
