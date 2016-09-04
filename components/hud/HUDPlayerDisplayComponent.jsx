var React = require('react');

var CharacterIcon = require('../characters/CharacterIconComponent.jsx').default;

var CharacterStore = require('../../stores/CharacterStore.js').default;

function getCharactersState () {
  return CharacterStore.getCharacters();
}

var PlayerDisplay = React.createClass({
  getInitialState: function() {
    return {
      characters: getCharactersState()
    }
  },
  updateState: function() {
    this.setState({
      characters: getCharactersState()
    });
  },
  componentWillMount: function () {
    CharacterStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    CharacterStore.removeListener("change", this._onChange);
  },
  buildChildren: function (character) {
    var isSelected = false;
    if (this.props.selection.type === 'character') {
      isSelected = (character.name === this.props.selection.name) ? true : false;
    }
    return(
      <CharacterIcon key={character.id} character={character} isSelected={isSelected}/>
    )
  },
  render: function() {
    var characters = this.state.characters;
    return(
      <div id='player-display' className='hud-window'>
        <name className='name'>{this.props.data.name}</name>
        <time className='time'>Day {Math.round(this.props.data.time)}</time>
        <characters className='characters'>{characters.map(this.buildChildren)}</characters>
      </div>
    )
  },
  _onChange: function () {
    this.updateState();
  }
});

export default PlayerDisplay;
