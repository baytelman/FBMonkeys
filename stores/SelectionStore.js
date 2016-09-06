import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class SelectionStore extends EventEmitter {
  constructor() {
    super();
    this.selection = {
      // type: 'character',
      // foo: 'bar'
    }
  }
  getSelection() {
    console.log("Selection:", this.selection);
    return this.selection;
  }
  setSelection(data) {
    console.log("Set Selection:");
    console.log("Data: ",data);
    this.selection = data;
    this.emit("change");
  }
  handleActions(action) {
    console.log("SelectionStore received an action:", action);
    switch(action.type) {
      case "GET_SELECTION": {
        this.getSelection();
        break;
      }
      case "SET_SELECTION": {
        this.setSelection(action.data);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const selectionStore = new SelectionStore;
dispatcher.register(selectionStore.handleActions.bind(selectionStore));
window.selectionStore = selectionStore;

export default selectionStore;
