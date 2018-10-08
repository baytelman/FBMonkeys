import React, { Component } from 'react';
import './App.css';
import BuildingView from './components/CityView';
import DebugMenu from './components/DebugMenu';
import PopulationView from './components/PopulationView';
import ResearchView from './components/ResearchView';
import ResourceIcon from './components/ResourceIcon';
import CityEvent, {
  kBuildingCompletedEvent,
  kCharacterAddedEvent,
  kEarnResourceEvent,
  kResearchProjectCompletedEvent,
  kSpendResourceEvent,
  kAvailableResearchChangedEvent
} from './controller/CityEvent';
import CitySerializer from './controller/CitySerializer';
import GameController from './controller/GameController';
import { MutableObject } from './controller/utils/Utils';

const STORAGE_KEY = 'CITY_SAVED_GAME';

const TICK_MS = 111;
class ResourcesView extends Component {
  state = {
    notifications: [],
    capacity: {},
    resources: {}
  };
  reset = () => {};
  onUpdate = events => {
    if (events && events.length) {
      this.setState(prev => {
        for (let event of events) {
          switch (event.type) {
            case kEarnResourceEvent:
            case kSpendResourceEvent:
              prev.notifications.push(MutableObject.mutableCopy(event));
              prev.resources = event.player.resources;
              break;
            case kBuildingCompletedEvent:
            case kResearchProjectCompletedEvent:
              if (event.data && event.data.player) {
                prev.capacity = event.data.player.getCapacity();
              }
              break;
            default:
              break;
          }
        }
        return prev;
      });
    }
  };
  render = () => (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        border: '2px solid rgba(0, 0, 0, .5)',
        background: 'rgba(255, 255, 255, .8)',
        borderRadius: 10
      }}>
      Resources
      {(Object.values(this.state.resources) || []).map(r => (
        <div tag={r.namespace}>
          <ResourceIcon {...r} maximum={this.state.capacity && this.state.capacity[r.namespace]} />
        </div>
      ))}
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.controller = new GameController({ onUpdate: this.onCityUpdate });
    this.state = {};
    this.views = [];
  }

  componentDidMount = () => {
    this.timer = setInterval(this.tick, TICK_MS);
  };

  tick = async () => {
    this.controller.updateTime((3 * TICK_MS) / 1000.0);
  };

  onCityUpdate = events => {
    if (events && events.length) {
      events.forEach(e => {
        e.player = this.controller.player;
      });
      this.views.forEach(v => v.onUpdate(events));
    }
  };

  onCollectFromBuilding = buildingId => {
    this.controller.collectFromBuilding(buildingId);
  };

  onPlanBuilding = ({ namespace, x, y }) => {
    this.controller.planBuilding({
      namespace: namespace,
      x,
      y
    });
  };
  onSetCharacterTasks = (charId, taskNamespaces) => {
    this.controller.setCharacterTasks(charId, taskNamespaces);
  };
  onScheduleResearch = namespace => {
    this.controller.scheduleResearch(namespace);
  };

  save = () => {
    let json = CitySerializer.serialize(this.controller.player);
    window.localStorage.setItem(STORAGE_KEY, json);
  };

  load = async () => {
    let json = window.localStorage.getItem(STORAGE_KEY);
    let player = CitySerializer.deserialize(json);
    this.controller.loadPlayer(player);
    for (let view of this.views) {
      await view.reset();
    }
    const buildingUpdates = Object.values(this.controller.player.city.buildings).map(
      b => new CityEvent({ type: kBuildingCompletedEvent, object: b })
    );
    const characterUpdates = Object.values(this.controller.player.city.characters).map(
      c => new CityEvent({ type: kCharacterAddedEvent, object: c })
    );
    this.onCityUpdate([
      this.controller.updateAvailableAreas(),
      ...buildingUpdates,
      ...characterUpdates,
      ...this.controller.getInitialEvents()
    ]);
  };

  render() {
    return (
      <div>
        <BuildingView
          onCollectFromBuilding={this.onCollectFromBuilding}
          onPlanBuilding={this.onPlanBuilding}
          ref={ref => this.views.push(ref)}
        />
        <ResourcesView ref={ref => this.views.push(ref)} />
        <PopulationView
          onSetCharacterTasks={this.onSetCharacterTasks}
          availableTasks={this.controller.module.availableTasks()}
          ref={ref => this.views.push(ref)}
        />
        <ResearchView
          onScheduleResearch={this.onScheduleResearch}
          ref={ref => this.views.push(ref)}
        />
        <DebugMenu save={this.save} load={this.load} />
      </div>
    );
  }
}
export default App;
