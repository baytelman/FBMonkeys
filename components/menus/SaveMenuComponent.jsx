const React = require('react');
const GameController = require('../../lib/controller/GameController.js').default;
const CitySerializer = require("../../lib/city/CitySerializer.js").default;

const STORAGE_KEY = "CITY_SAVED_GAME";

var SaveMenu = React.createClass({
  save: function() {
    let controller = GameController.instance;
		let json = CitySerializer.serialize(GameController.instance.player);
    window.localStorage.setItem(STORAGE_KEY, json);
  },
  load: function() {
    let json = window.localStorage.getItem(STORAGE_KEY);
		let player = CitySerializer.deserialize(json);
    Object.assign(GameController.instance.player, player);
  },
  speedUp: function() {
    GameController.instance.tick(60);
  },
  render: function() {
    return(
      <div id='build-menu'>
      <ul>
      <li>
      <button onClick={ this.save }>Save</button>
      <button onClick={ this.load }>Load</button>
      <button onClick={ this.speedUp }>Speed Up</button>
      </li>
      </ul>
      </div>
    )
  }
});

export default SaveMenu;
