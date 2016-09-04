var React = require('react');

var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var Player = require('./PlayerComponent.jsx').default;
var Building = require('./BuildingComponent.jsx').default;

var BuildingStore = require('../stores/BuildingStore.js').default;
var BuildingActions = require('../actions/BuildingActions.js');

var SelectionStore = require('../stores/SelectionStore.js').default;
var SelectionActions = require('../actions/SelectionActions.js');

var PlayerStore = require('../stores/PlayerStore.js').default;
var PlayerActions = require('../actions/PlayerActions.js');

function getSelectionState () {
  return SelectionStore.getSelection();
}

function getBuildingsState () {
  return BuildingStore.getBuildings();
}

function getModeState () {
  return PlayerStore.getMode();
}

var City = React.createClass({
  getInitialState: function() {
    return {
      secondsElapsed: 0,
      player: this.props.player,
      buildings: getBuildingsState(),
      selection: getSelectionState(),
      mode: getModeState()
    }
  },
  tick: function() {
    this.state.player.updateTime(1);
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  updateModeState: function () {
    this.setState({
      mode: getModeState()
    });
  },
  updateSelectionState: function () {
    this.setState({
      selection: getSelectionState()
    });
  },
  updateBuildingState: function () {
    this.setState({
      buildings: getBuildingsState()
    });
  },
  componentWillMount: function() {
    PlayerStore.on("change", this._onModeChange);
    SelectionStore.on("change", this._onSelectionChange);
    BuildingStore.on("change", this._onBuildingChange);
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    PlayerStore.removeListener("change", this._onModeChange);
    SelectionStore.removeListener("change", this._onSelectionChange);
    BuildingStore.removeListener("change", this._onBuildingChange);
    clearInterval(this.interval);
  },
  render: function() {
    let rows  = [];
    let xsize = 28;
    let ysize = 14;
    for (var y = -ysize; y <= ysize; y++) {
      let columns = [];
      for (var x = -xsize; x <= xsize; x++) {
        var building = null;
        // Check if this location contains a building
        for (var i = 0; i < this.state.buildings.length; i++) {
          if ((this.state.buildings[i].location.x === x) && (this.state.buildings[i].location.y === y)) {
            building = this.state.buildings[i];
          }
        }
        let location = {
          x:x,
          y:y
        }
        let bComponent = <Building data={building} location={location} player={this.props.player} mode={this.state.mode}/>;
        columns.push(<td className="gridCell" key={'row' + x + '_col' + y}>{bComponent}</td>);
      }
      rows.push(<tr key={'col' + y}>{columns}</tr>);
    }
    return (
      <game id='game'>
        <table id={this.props.player.city.id} onClick={this._onClick}>
          <tbody>{rows}</tbody>
        </table>
        <Player player={this.props.player} selection={this.state.selection} />
      </game>
    );
  },
  _onModeChange: function () {
    this.updateModeState();
    console.log('Mode state changed in CityComponent')
  },
  _onBuildingChange: function () {
    this.updateBuildingState();
    console.log('Building state changed in CityComponent')
  },
  _onSelectionChange: function () {
    this.updateSelectionState();
    console.log('Selection state changed in CityComponent')
  },
  _onClick: function () {
    var data = {};
    SelectionActions.setSelection(data);
    PlayerActions.setMode('normal');
  }
});

export default City;
