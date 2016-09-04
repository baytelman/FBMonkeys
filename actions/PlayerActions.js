import dispatcher from '../dispatcher.js';

export function getMode() {
  dispatcher.dispatch({
    type: "GET_MODE"
  })
}

export function setMode(mode) {
  dispatcher.dispatch({
    type: "SET_MODE",
    mode: mode
  })
}
