import dispatcher from '../dispatcher.js';

export function getAlerts() {
  dispatcher.dispatch({
    type: "GET_ALERTS"
  })
}

export function addAlert(message) {
  dispatcher.dispatch({
    type: "ADD_ALERT",
    message: message
  })
}
