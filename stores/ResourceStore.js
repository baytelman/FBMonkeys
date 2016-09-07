import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class ResourceStore extends EventEmitter {
  constructor() {
    super();
    this.resources = [
      {
        id: '1',
        name: 'wood',
        amount: 10
      },
      {
        id: '2',
        name: 'stone',
        amount: 10
      },
      {
        id: '3',
        name: 'gold',
        amount: 10
      }
    ];
  }
  getResources() {
    console.log("Resources:", this.resources);
    return this.resources;
  }
  addResource(id, amount, name) {
    let resources = this.resources,
        added     = false;
    // If players already owns some of this category of resource, add resource amount to existing supply
    for (var i = 0; i < resources.length; i++) {
      if (resources[i].id === id) {
        resources[i].amount += amount;
        added = true;
      }
    }
    // If players does not yet own any of this category of resource, add new resource object to this.resources array
    if (!added) {
      resources.push({
        id: id,
        amount: amount,
        name: name
      })
    }
    this.emit("change");
  }
  addResourceByName(name, amount) {
    let resources = this.resources,
        added     = false;
    // If players already owns some of this category of resource, add resource amount to existing supply
    for (var i = 0; i < resources.length; i++) {
      if (resources[i].name === name) {
        resources[i].amount += amount;
        added = true;
      }
    }
    // If players does not yet own any of this category of resource, add new resource object to this.resources array
    if (!added) {
      resources.push({
        id: 100,
        amount: amount,
        name: name
      })
    }
    this.emit("change");
  }
  removeResource(id, amount) {
    let resources = this.resources;
    // If players owns any of this category of resource, add resource amount to existing supply
    for (var i = 0; i < resources.length; i++) {
      if (resources[i].id === id) {
        // If we are removing more than the player owns, simply set amount to 0
        if (resources[i].amount > amount) { resources[i].amount -= amount; }
        else { resources[i].amount = 0; }
      }
    }
    this.resources = resources;
    this.emit("change");

  }
  handleActions(action) {
    console.log("ResourceStore received an action:", action);
    switch(action.type) {
      case "GET_RESOURCES": {
        this.getResources();
        break;
      }
      case "ADD_RESOURCE": {
        this.addResource(action.id, action.amount, action.name);
        break;
      }
      case "ADD_RESOURCE_BY_NAME": {
        this.addResourceByName(action.name, action.amount);
        break;
      }
      case "REMOVE_RESOURCE": {
        this.removeResource(action.id, action.amount);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const resourceStore = new ResourceStore;
dispatcher.register(resourceStore.handleActions.bind(resourceStore));
window.dispatcher = dispatcher;
window.resourceStore = resourceStore;

export default resourceStore;
