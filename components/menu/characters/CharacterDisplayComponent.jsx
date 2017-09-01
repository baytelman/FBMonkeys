import React from 'react';
import {ResourceIcon} from '../resources/ResourceIconComponent.jsx';
const GameController = require('../../../lib/controller/GameController.js').default;

const MAX_TASKS = 2;

var CharacterDisplay = React.createClass({
  assignTaskMenu: function (characterId, availableTasks, assignedTask, taskIndex, assignTaskCallback) {
    let options = availableTasks.map(task => (
      <option
        key={characterId + "_task_" + taskIndex + "_option_" + task.namespace}
        value={task.namespace}>{task.name}</option>
    ));

    let handleChange = function (event) {
      let value = event.target.value;
      assignTaskCallback(value, taskIndex);
    }

    return (
      <select
        key={characterId + "_task_" + taskIndex}
        value={assignedTask}
        onChange={handleChange}>{options}</select>
    );
  },
  activeTasks: function (character) {
    let availableTasks = Object.values(GameController.instance.module.availableTasks()).filter(t => t.isAvailable(this.props.player));
    availableTasks.unshift({
      namespace: "",
      name: 'Unassigned'
    });

    let assignedTaskNamespaces = character
      .tasks
      .map(t => t.namespace);

    let assignTask = function (task, index) {
      assignedTaskNamespaces[index] = task;

      GameController
        .instance
        .setCharacterTasks(character.id, assignedTaskNamespaces.filter(n => n && n.length));
    };
    return Array(MAX_TASKS)
      .fill()
      .map((_, taskIndex) => {
        return {
          task: assignedTaskNamespaces[taskIndex],
          menu: this.assignTaskMenu(character.id, availableTasks, assignedTaskNamespaces[taskIndex], taskIndex, assignTask)
        };
      });
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
        <table key="list" className='characters'>
          <tbody>
            {characters.map((character) => (
              <tr key={character.id}>
                <td key={character.id + "_name"}>
                  {ResourceIcon('monkey')}
                  {character.name}
                </td>
                {this
                  .activeTasks(character)
                  .map((item, index) => {
                    let active = character.activeTask && item.task && character.activeTask.namespace == item.task;
                    return <td
                      key={character.id + "_task_" + index}
                      style={{
                      borderBottom: active
                        ? '1px solid red'
                        : '1px solid white'
                    }}>
                      {item.menu}
                    </td>
                  })}
              </tr>
            ))
}
          </tbody>
        </table>
      </div>
    );
  }
});

export default CharacterDisplay;
