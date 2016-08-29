var React = require('react');

var PlayerDisplay   = require('./hud/HUDPlayerDisplayComponent.jsx').default;
var AlertDisplay    = require('./hud/HUDAlertDisplayComponent.jsx').default;
var ResourceDisplay = require('./hud/HUDResourceDisplayComponent.jsx').default;
var ControlPanel    = require('./hud/HUDControlPanelComponent.jsx').default;

var Resource = require('./ResourceComponent.jsx').default;

var Player = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var playerClassName = 'player hud';
    return(
      <player className={playerClassName} id={this.props.data.id}>
        <PlayerDisplay data={this.props.data} />
        <AlertDisplay data={this.props.data} />
        <ResourceDisplay data={this.props.data} />
        <ControlPanel data={this.props.data} />
      </player>
    )
  }
});

export default Player;
