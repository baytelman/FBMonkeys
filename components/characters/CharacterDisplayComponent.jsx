const React = require('react');

var CharacterDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let characters = Object.values(this.props.player.city.characters);
    return (
      <div id='character-display' className='hud-window'>
        <span>Characters</span>
        <characters className='characters'>
          {
            characters.map((character) => (
              <div>
              {character.name}
              </div>
            ))
          }
        </characters>
      </div>
    );
  }
});

export default CharacterDisplay;
