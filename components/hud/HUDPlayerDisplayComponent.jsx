var React = require('react');

var buildingStore = require('../../stores/BuildingStore.js').default;

function getBuildingsState () {
  return buildingStore.getBuildings();
}

var PlayerDisplay = React.createClass({
  getInitialState: function() {
    return {
      buildings: getBuildingsState()
    }
  },
  updateState: function() {
    this.setState({
      buildings: getBuildingsState()
    });
  },
  buildChildren: function (building) {
    return(
      <div key={building.id}>
        <div>{building.name} - <span>{building.type}</span></div>
      </div>
    )
  },
  render: function() {
    var buildings = this.state.buildings;
    return(
      <div id='player-display' className='hud-window'>
        <name>{this.props.data.name}</name>
        <time>{Math.round(this.props.data.time)}</time>
        <buildings>{buildings.map(this.buildChildren)}</buildings>
      </div>
    )
  }
});

export default PlayerDisplay;
