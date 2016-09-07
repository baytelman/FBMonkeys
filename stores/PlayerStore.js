import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class PlayerStore extends EventEmitter {
    constructor() {
        super();
        this.mode = 'normal';
        // Possible modes - normal, placing
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        this.emit("change");
    }
    handleActions(action) {
        console.log("PlayerStore received an action:", action);
        switch(action.type) {
            case "GET_MODE": {
                this.getMode();
                break;
            }
            case "SET_MODE": {
                this.setMode(action.mode);
                break;
            }
            default: {
                break;
            }
        }
    }
}

const playerStore = new PlayerStore;
dispatcher.register(playerStore.handleActions.bind(playerStore));
window.playerStore = playerStore;

export default playerStore;
