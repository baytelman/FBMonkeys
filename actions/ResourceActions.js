import dispatcher from '../dispatcher.js';

export function getResources() {
  dispatcher.dispatch({
    type: "GET_RESOURCES"
  })
}

export function addResource(id, amount, name) {
  dispatcher.dispatch({
    type: "ADD_RESOURCE",
    id: id,
    amount: amount,
    name: name
  })
}

export function addResourceByName(name, amount) {
  dispatcher.dispatch({
    type: "ADD_RESOURCE_BY_NAME",
    name: name,
    amount: amount
  })
}

export function removeResource(id, amount) {
  dispatcher.dispatch({
    type: "REMOVE_RESOURCE",
    id: id,
    amount: amount
  })
}
