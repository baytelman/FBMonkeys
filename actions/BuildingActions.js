import dispatcher from '../dispatcher.js';

export function getBuildings() {
  dispatcher.dispatch({
    type: "GET_BUILDINGS"
  })
}

export function getBuildingAtLocation(location) {
  dispatcher.dispatch({
    type: "GET_BUILDING_AT_LOCATION",
    location: location
  })
}

export function addBuilding(building) {
  dispatcher.dispatch({
    type: "ADD_BUILDING",
    building: building
  })
}
