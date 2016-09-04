var React = require('react');

var SelectionActions = require('../../actions/SelectionActions.js');

var CharacterIcon = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var id = 'char-' + this.props.character.id.toString();
    var iconClassName = (this.props.isSelected) ? 'character-icon selected' : 'character-icon';
    return(
      <character className='character' id={id} onMouseOver={this._onHover} onClick={this._onClick}>
        <div className={iconClassName}>
          <div className='character-health'></div>
        </div>
        <span className='character-name'>{this.props.character.name}</span>
      </character>
    )
  },
  _onHover: function () {
    var msg = 'Hovering on ' + this.props.character.name + '.';
    console.log(msg);
  },
  _onClick: function () {
    var data = {
      type: 'character',
      name: this.props.character.name,
      currentHealth: this.props.character.currentHealth,
      health: this.props.character.health,
      race: this.props.character.race,
      age: this.props.character.age,
      gender: this.props.character.gender,
      mood: this.props.character.mood,
      sleep: this.props.character.sleep,
      social: this.props.character.social,
      skills: this.props.character.skills
    };
    SelectionActions.setSelection(data);
  }
});

export default CharacterIcon;
