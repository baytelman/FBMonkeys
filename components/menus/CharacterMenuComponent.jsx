const React = require('react');

var CharacterMenu = React.createClass({
  getInitialState: function() {
    return {}
  },
  buildSkillsList: function (skills) {
    return Object.keys(skills).map( function (key) {
      var reactKey = 'skill-'+key;
      return (
        <div key={reactKey}>
          <span>{key}: </span>
          <span>{skills[key]}</span>
        </div>
      )
    })
  },
  render: function() {
    var health = this.props.selection.currentHealth + '/' + this.props.selection.health;
    var location = this.props.selection.location.x + ' , ' + this.props.selection.location.y;
    return(
      <div id='character-menu'>
        <div>Name: {this.props.selection.name}</div>
        <div>Health: {health}</div>
        <div>Race: {this.props.selection.race}</div>
        <div>Age: {this.props.selection.age}</div>
        <div>Location: {location}</div>
        <div>Gender: {this.props.selection.gender}</div>
        <div>Mood: {this.props.selection.mood}</div>
        <div>Sleep: {this.props.selection.sleep}</div>
        <div>Social: {this.props.selection.social}</div>
        <div>Skills: {this.buildSkillsList(this.props.selection.skills)}</div>
      </div>
    )
  }
});

export default CharacterMenu;
