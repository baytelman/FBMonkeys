import React from 'react';
import {ResourceIcon} from '../resources/ResourceIconComponent.jsx';
const GameController = require('../../../lib/controller/GameController.js').default;

var CharacterDisplay = React.createClass({
  activeTaskMenu: function (character) {
    let value = character
      .tasks
      .map(t => t.namespace)[0];
    let tasks = [
      {
        namespace: "",
        name: 'Unassigned'
      }
    ].concat(Object.values(GameController.instance.module.availableTasks()));

    let options = tasks.map(task => (
      <option value={task.namespace}>{task.name}</option>
    ));

    let handleChange = function (event) {
      let value = event.target.value;
      if (value && value.length > 0) {
        GameController
          .instance
          .setCharacterTasks(character.id, [value]);
      } else {
        GameController
          .instance
          .setCharacterTasks(character.id, []);
      }
    }

    return (
      <select key={character.id + "_task"} value={value} onChange={handleChange}>{options}</select>
    );
  },
  render: function () {
    let characters = Object.values(this.props.player.city.characters);
    if (characters.length == 0) {
      return null;
    }
    let capacity = this
      .props
      .player
      .getCapacity();
    return (
      <div key="characters" id='character-display' className='hud-window'>
        <b key="title">Characters</b>
        <characters key="list" className='characters'>
          {characters.map((character) => (
            <div key={character.id}>
              {ResourceIcon('monkey')}
              {character.name}
              {this.activeTaskMenu(character)}
            </div>
          ))
}
        </characters>
      </div>
    );
  }
});

export default CharacterDisplay;
