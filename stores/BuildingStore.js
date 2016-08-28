import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class BuildingStore extends EventEmitter {
    constructor() {
        super();
        this.buildings = [
            {
                id: '57189265er',
                name: 'The Drunken Goat',
                type: 'Tavern'
            }
        ];
    }
    getBuildings() {
        console.log("Builings:", this.buildings);
        return this.buildings;
    }
    handleActions(action) {
        console.log("BuildingStore received an action:", action);
        switch(action.type) {
            case "GET_BUILDINGS": {
                this.getBuildings();
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
