const React = require('react');

const Character = require('./characters/CharacterComponent.jsx').default;

var CharactersLayerComponent = React.createClass({
  getInitialState: function () {
    return {};
  },
  buildChildren: function (character) {
    let className = 'character character-id-' + character.id;
    return (
        <Character key={character.id} mode={this.props.mode} character={character} className={className} location={character.location} />
    )
  },
  render: function () {
    return(
      <div id="characters-layer">
        {this.props.characters.map( this.buildChildren )}
      </div>
    );
  }
})

export default CharactersLayerComponent;
