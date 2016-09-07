var React = require('react');

var CharacterDisplay = require('./hud/HUDCharacterDisplayComponent.jsx').default;
var AlertDisplay     = require('./hud/HUDAlertDisplayComponent.jsx').default;
var ResourceDisplay  = require('./hud/HUDResourceDisplayComponent.jsx').default;
var ControlPanel     = require('./hud/HUDControlPanelComponent.jsx').default;
var SelectionDisplay = require('./hud/HUDSelectionDisplayComponent.jsx').default;

var SelectionActions = require('../actions/SelectionActions.js');
var PlayerActions = require('../actions/PlayerActions.js');

// THE PLAYER COMPONENT IS THE CAMERA
var Player = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var playerClassName = 'player hud';
    return(
      <player className={playerClassName} id={this.props.player.id} onClick={this._onClick}>
        <CharacterDisplay data={this.props.player} selection={this.props.selection} characters={this.props.characters} mode={this.props.mode}/>
        <AlertDisplay data={this.props.player} />
        <ResourceDisplay data={this.props.player} />
        <ControlPanel data={this.props.player} mode={this.props.mode} />
        <SelectionDisplay data={this.props.player} selection={this.props.selection} />
      </player>
    )
  },
  _onClick: function () {
    // var data = {};
    // SelectionActions.setSelection(data);
    // PlayerActions.setMode('normal');
  }
});

export default Player;
