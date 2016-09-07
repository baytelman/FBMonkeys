import dispatcher from '../dispatcher.js';

export function getSelection() {
  dispatcher.dispatch({
    type: "GET_SELECTION"
  })
}

export function setSelection(data) {
  dispatcher.dispatch({
    type: "SET_SELECTION",
    data: data
  })
}
