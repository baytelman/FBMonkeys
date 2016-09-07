var React = require('react');

var CharacterIcon = require('../characters/CharacterIconComponent.jsx').default;

var CharacterDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  buildChildren: function (character) {
    var isSelected = false;
    if (this.props.selection.type === 'character') {
      isSelected = (character.name === this.props.selection.name) ? true : false;
    }
    return(
      <CharacterIcon key={character.id} character={character} isSelected={isSelected} mode={this.props.mode}/>
    )
  },
  render: function() {
    var characters = this.props.characters;
    return(
      <div id='character-display' className='hud-window'>
        <name className='name'>{this.props.data.name}</name>
        <time className='time'>Time: {Math.round(this.props.data.time)}</time>
        <characters className='characters'>{characters.map(this.buildChildren)}</characters>
      </div>
    )
  }
});

export default CharacterDisplay;
