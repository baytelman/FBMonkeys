const React = require('react');

var SelectionActions = require('../../actions/SelectionActions.js');

window.ca = require('../../actions/CharacterActions.js');

var Character = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var locationStyle = {
      top: this.props.location.y,
      left: this.props.location.x
    }
    return(
      <div className='character-model' style={locationStyle} onClick={this._onClick}>{this.props.character.name}</div>
    );
  },
  _onClick: function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.mode === 'placing') {
      return false;
    }
    var data = {
      type: 'character',
      name: this.props.character.name,
      currentHealth: this.props.character.currentHealth,
      health: this.props.character.health,
      race: this.props.character.race,
      age: this.props.character.age,
      location: this.props.character.location,
      gender: this.props.character.gender,
      mood: this.props.character.mood,
      sleep: this.props.character.sleep,
      social: this.props.character.social,
      skills: this.props.character.skills
    };
    SelectionActions.setSelection(data);
  },
})

export default Character;
