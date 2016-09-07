var React = require('react');

var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var Player = require('./PlayerComponent.jsx').default;
var Tile = require('./TileComponent.jsx').default;

var SelectionStore = require('../stores/SelectionStore.js').default;
var SelectionActions = require('../actions/SelectionActions.js');

var BuildingStore = require('../stores/BuildingStore.js').default;
var BuildingActions = require('../actions/BuildingActions.js');

var CharacterStore = require('../stores/CharacterStore.js').default;
var CharacterActions = require('../actions/CharacterActions.js');

var PlayerStore = require('../stores/PlayerStore.js').default;
var PlayerActions = require('../actions/PlayerActions.js');

function getSelectionState () {
  return SelectionStore.getSelection();
}
function getBuildingsState () {
  return BuildingStore.getBuildings();
}
function getCharactersState () {
  return CharacterStore.getCharacters();
}
function getModeState () {
  return PlayerStore.getMode();
}

var City = React.createClass({
  getInitialState: function () {
    return {
      secondsElapsed: 0,
      player: this.props.player,
      selection: getSelectionState(),
      buildings: getBuildingsState(),
      characters: getCharactersState(),
      mode: getModeState()
    }
  },
  tick: function() {
    this.state.player.updateTime(1);
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
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
  updateCharacterState: function () {
    this.setState({
      characters: getCharactersState()
    });
  },
  updateModeState: function () {
    this.setState({
      mode: getModeState()
    });
  },
  componentWillMount: function () {
    SelectionStore.on("change", this._onSelectionChange);
    BuildingStore.on("change", this._onBuildingChange);
    CharacterStore.on("change", this._onCharacterChange);
    PlayerStore.on("change", this._onModeChange);
  },
  componentDidMount: function () {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    SelectionStore.removeListener("change", this._onSelectionChange);
    BuildingStore.removeListener("change", this._onBuildingChange);
    CharacterStore.removeListener("change", this._onCharacterChange);
    PlayerStore.removeListener("change", this._onModeChange);
    clearInterval(this.interval);
  },
  render: function () {
    let rows  = [];
    let xsize = 28;
    let ysize = 14;
    // let xsize = 49;
    // let ysize = 49;
    for (var y = -ysize; y <= ysize; y++) {
      let columns = [];
      for (var x = -xsize; x <= xsize; x++) {
        var building  = null,
            character = null;
        // Check if this location contains a building
        for (var i = 0; i < this.state.buildings.length; i++) {
          if ((this.state.buildings[i].location.x === x) && (this.state.buildings[i].location.y === y)) {
            building = this.state.buildings[i];
          }
        }
        // Check if this location contains a character
        for (var i = 0; i < this.state.characters.length; i++) {
          if ((this.state.characters[i].location.x === x) && (this.state.characters[i].location.y === y)) {
            character = this.state.characters[i];
          }
        }
        let location = {
          x:x,
          y:y
        }
        let tileComponent = <Tile building={building} location={location} player={this.state.player} selection={this.state.selection} characters={this.state.characters} character={character} mode={this.state.mode}/>;
        columns.push(<td className="gridCell" key={'row' + x + '_col' + y}>{tileComponent}</td>);
      }
      rows.push(<tr key={'col' + y}>{columns}</tr>);
    }
    return (
      <game id='game'>
        <table id={this.props.player.city.id} onClick={this._onClick}>
          <tbody>{rows}</tbody>
        </table>
        <Player player={this.props.player} selection={this.state.selection} characters={this.state.characters} mode={this.state.mode}/>
      </game>
    );
  },
  _onSelectionChange: function () {
    this.updateSelectionState();
  },
  _onBuildingChange: function () {
    this.updateBuildingState();
  },
  _onCharacterChange: function () {
    this.updateCharacterState();
  },
  _onModeChange: function () {
    this.updateModeState();
  },
  _onClick: function () {
    var data = {};
    SelectionActions.setSelection(data);
    PlayerActions.setMode('normal');
  }
});

export default City;
