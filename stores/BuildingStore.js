import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class BuildingStore extends EventEmitter {
  constructor() {
    super();
    this.buildings = [
      // {
      //     completed: [],
      //     costs: [],
      //     effects: [],
      //     id: '57189265er',
      //     location: {
      //         x: 0,
      //         y: 0
      //     },
      //     name: 'Tavern - The Drunken Goat',
      //     time: 15,
      // }
    ];
  }
  getBuildings() {
    console.log("Builings:", this.buildings);
    return this.buildings;
  }
  getBuildingAtLocation(location) {
    for (var i = 0; i < this.buildings.length; i++) {
      let existingBuilding = this.buildings[i];
      if (existingBuilding.location.is(location)) {
        return existingBuilding;
      }
    }
    return null;
  }
  addBuilding(building) {
    this.buildings.push(building);
    this.emit("change");
  }
  handleActions(action) {
    console.log("BuildingStore received an action:", action);
    switch(action.type) {
      case "GET_BUILDINGS": {
        this.getBuildings();
        break;
      }
      case "GET_BUILDING_AT_LOCATION": {
        this.getBuildingAtLocation(action.location);
        break;
      }
      case "ADD_BUILDING": {
        this.addBuilding(action.building);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const buildingStore = new BuildingStore;
dispatcher.register(buildingStore.handleActions.bind(buildingStore));
window.buildingStore = buildingStore;

export default buildingStore;
