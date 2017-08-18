import React from 'react';
import {ResourceIcon} from '../resources/ResourceIconComponent.jsx';

var CharacterDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let characters = Object.values(this.props.player.city.characters);
    return (
      <div id='character-display' className='hud-window'>
        <b>Characters</b>
        <characters className='characters'>
          {characters.map((character) => (
            <div>
              {ResourceIcon('monkey')}
              {character.name}
              {character.activeTask ? " will " + character.activeTask.getDescription() : null }
            </div>
          ))
}
        </characters>
      </div>
    );
  }
});

export default CharacterDisplay;
