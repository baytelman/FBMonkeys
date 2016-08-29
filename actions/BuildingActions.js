import dispatcher from '../dispatcher.js';

export function getBuildings() {
    dispatcher.dispatch({
        type: "GET_BUILDINGS"
    })
}
