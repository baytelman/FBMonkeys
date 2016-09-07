import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

var UUIDjs = require('uuid-js');

class AlertStore extends EventEmitter {
  constructor() {
    super();
    this.alerts = [
      {
        id: '1qv31h15yy',
        message: 'Bill is starving.'
      },
      {
        id: '2qv31h15yy',
        message: 'Your dog Betsy is sick with puppy flu and must be rescued.'
      }
    ];
  }
  getAlerts() {
    console.log("Alerts:", this.alerts);
    return this.alerts;
  }
  addAlert(message) {
    let id    = UUIDjs.create().toString(),
        alert = {
      id: id,
      message: message
    }
    this.alerts.push(alert);
    this.emit("change");
  }
  handleActions(action) {
    console.log("AlertStore received an action:", action);
    switch(action.type) {
      case "GET_ALERTS": {
        this.getAlerts();
        break;
      }
      case "ADD_ALERT": {
        this.addAlert(action.message);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const alertStore = new AlertStore;
dispatcher.register(alertStore.handleActions.bind(alertStore));
window.alertStore = alertStore;

export default alertStore;
