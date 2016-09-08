const React = require('react');

const SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
const SquareCoordinate = SquareCoordinateJS.SquareCoordinate;
const BuildingJS = require('../lib/city/Building.js');
const BuildingModel = BuildingJS.Building;
const CityResourceJS = require('../lib/city/CityResource.js');
const CityResource = CityResourceJS.CityResource;

const SelectionActions = require('../actions/SelectionActions.js');
const PlayerActions = require('../actions/PlayerActions.js');
const AlertActions = require("../actions/AlertActions.js");

var Tile = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var hoverStateClass = (this.props.mode === 'placing') ? ' cell-placement-hover-state' : '';
    if (!this.props.building) {
      return <nothing className={hoverStateClass} onClick={this._onEmptyClick} onMouseOver={this._onEmptyHover}></nothing>;
    }
    var abbrev = this.props.building.name.substr(0,4) ;
    var classname = 'building building-type-' + this.props.building.name + hoverStateClass;
    return(
      <building className={classname} id={this.props.building.id} onClick={this._onClick}>
        <name className='building-name'>{ abbrev }</name>
        <status className='building-status'>{ this.props.building.isCompleted()?"✓":Math.round(100 * this.props.building.progress()) + "%" }</status>
      </building>
    )
  },
  _onClick: function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.mode === 'placing') {
      return false;
    }
    var data = {
      type: 'building',
      data: this.props.building
    };
    SelectionActions.setSelection(data);
  },
  _onEmptyClick: function (event) {
    if (this.props.mode === 'placing') {
      event.stopPropagation();
      var buildingName = this.props.selection.name;
      var x = this.props.location.x;
      var y = this.props.location.y;
      this.props.player.city.planBuilding({
        building: new BuildingModel({
          name: buildingName,
          costs: [CityResource.construction(120)],
          effects: [new PlayerEarnResourceEffect({
            resources:[CityResource.gold(1)],
            frequency: 3
          })]
        }),
        location: new SquareCoordinate(x,y)
      });
      PlayerActions.setMode('normal');
      AlertActions.addAlert("Building Placed: " + buildingName);
      SelectionActions.setSelection({});
    }
  },
  _onEmptyHover: function (event) {
    if (this.props.mode === 'placing') {
      console.log('Hovering Empty Space in placement mode');
    } else {
      console.log('Hovering Empty Space in normal mode');
    }
  }
});

export default Tile;
