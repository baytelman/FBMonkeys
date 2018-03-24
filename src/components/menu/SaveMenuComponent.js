import React, {Component} from 'react'
import GameController  from '../../lib/controller/GameController';
import CitySerializer  from "../../lib/city/CitySerializer.js";

const STORAGE_KEY = "CITY_SAVED_GAME";

export default class SaveMenu extends Component {
  save() {
    let json = CitySerializer.serialize(GameController.instance.player);
    window
      .localStorage
      .setItem(STORAGE_KEY, json);
  }
  load() {
    let json = window
      .localStorage
      .getItem(STORAGE_KEY);
    let player = CitySerializer.deserialize(json);
    GameController
      .instance
      .loadPlayer(player);
  }
  speedUp() {
    GameController
      .instance
      .tick(60);
  }
  render() {
    return (
      <div id='build-menu'>
        <button onClick={this.save}>Save</button>
        <button onClick={this.load}>Load</button>
        <button onClick={this.speedUp}>Speed Up</button>
      </div>
    )
  }
}
