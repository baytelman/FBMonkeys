import React, { Component } from 'react';

import { MutableObject } from '../controller/utils/Utils';
import {
  kCharacterAddedEvent,
  kCharacterRemovedEvent,
  kCharacterTasksAssigned
} from '../controller/CityEvent';

const TaskElement = ({
  task,
  isActive,
  priority,
  onIncreaseTaskPriority,
  onDecreaseTaskPriority
}) => (
  <span
    style={{
      ...styles.task,
      ...(isActive ? styles.activeTask : {}),
      ...(priority === undefined ? styles.unasignedTask : {})
    }}>
    [{priority !== 0 ? <a onClick={onIncreaseTaskPriority}>{' + '}</a> : null}
    {task.name}
    {priority !== undefined ? (
      <a onClick={onDecreaseTaskPriority}>{' - '}</a>
    ) : null}
    ]
  </span>
);

class PopulationView extends Component {
  state = {
    notifications: [],
    characters: {},
    characterActiveTasks: {}
  };

  reset = () => {};
  onUpdate = events => {
    if (events && events.length) {
      this.setState(prev => {
        for (let event of events) {
          switch (event.type) {
            case kCharacterRemovedEvent:
            prev.characters && delete prev.characters[event.object.id];
            prev.characterActiveTasks && delete prev.characterActiveTasks[event.object.id];
            break;
            case kCharacterAddedEvent:
              prev.notifications.push(MutableObject.mutableCopy(event));
            // falls through
            case kCharacterTasksAssigned:
              prev.characters = prev.characters || {};
              prev.characters[event.object.id] = event.object;
              prev.characterActiveTasks[event.object.id] = event.object.activeTask;
              break;
            default:
              break;
          }
        }
        return prev;
      });
    }
  };

  changeTaskPriority = (character, taskNamespace, increase = true) => {
    const tasks = character.tasks.map(t => t.namespace);
    const originalIndex = tasks.indexOf(taskNamespace);
    if (originalIndex === 0 && increase) {
      return;
    } else if (originalIndex === -1) {
      if (increase) {
        tasks.push(taskNamespace);
      }
    } else {
      tasks.splice(originalIndex, 1);
      tasks.splice(originalIndex + (increase ? -1 : 1), 0, taskNamespace);
    }
    this.props.onSetCharacterTasks(character.id, tasks);
  };
  onIncreaseTaskPriority = (character, taskNamespace) => {
    this.changeTaskPriority(character, taskNamespace, true);
  };

  onDecreaseTaskPriority = (character, taskNamespace) => {
    this.changeTaskPriority(character, taskNamespace, false);
  };

  renderTasks = character => {
    const priorities = character.tasks.map(t => t.namespace);
    return [
      ...character.tasks.map((task, index) => (
        <TaskElement
          task={task}
          isActive={
            character &&
            character.activeTask &&
            character.activeTask.namespace === task.namespace
          }
          priority={index}
          onDecreaseTaskPriority={() =>
            this.onDecreaseTaskPriority(character, task.namespace)
          }
          onIncreaseTaskPriority={() =>
            this.onIncreaseTaskPriority(character, task.namespace)
          }
        />
      )),
      ...Object.values(this.props.availableTasks)
        .filter(task => priorities.indexOf(task.namespace) === -1)
        .map(task => (
          <TaskElement
            task={task}
            onIncreaseTaskPriority={() =>
              this.onIncreaseTaskPriority(character, task.namespace)
            }
          />
        ))
    ];
  };

  render = () => (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        padding: 10,
        border: '2px solid rgba(0, 0, 0, .5)',
        background: 'rgba(255, 255, 255, .8)',
        borderRadius: 10
      }}>
      Characters
      {(Object.values(this.state.characters) || []).map(c => (
        <div tag={c.id}>
          <span>{c.name}</span>
          {this.renderTasks(c)}
        </div>
      ))}
    </div>
  );
}

const styles = {
  task: {
    padding: 3
  },
  activeTask: {
    textDecoration: 'underline'
  },
  unasignedTask: {
    color: 'gray'
  }
};

export default PopulationView;
