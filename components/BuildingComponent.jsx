var React = require('react');

var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;
var BuildingJS = require('../lib/city/Building.js');
var BuildingModel = BuildingJS.Building;
var CityResourceJS = require('../lib/city/CityResource.js');
var CityResource = CityResourceJS.CityResource;

var SelectionStore = require('../stores/SelectionStore.js').default;
var SelectionActions = require('../actions/SelectionActions.js');

var PlayerActions = require('../actions/PlayerActions.js');

var AlertActions = require("../actions/AlertActions.js");

var Building = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var hoverStateClass = (this.props.mode === 'placing') ? ' cell-placement-hover-state' : '';
    if (! this.props.data) {
      return <nothing className={hoverStateClass} onClick={this._onEmptyClick} onMouseOver={this._onEmptyHover}></nothing>;
    }
    var abbrev = this.props.data.name.substr(0,4) ;
    var classname = 'building building-type-' + this.props.data.name + hoverStateClass;
    return(
      <building className={classname} id={this.props.data.id} onClick={this._onClick}>
        <name className='building-name'>{ abbrev }</name>
        <status className='building-status'>{ this.props.data.isCompleted()?"✓":Math.round(100 * this.props.data.progress()) + "%" }</status>
      </building>
    )
  },
  _onClick: function (event) {
    event.preventDefault();
    event.stopPropagation();
    var data = {
      type: 'building',
      data: this.props.data
    };
    SelectionActions.setSelection(data);
  },
  _onEmptyClick: function (event) {
    if (this.props.mode === 'placing') {
      event.stopPropagation();
      var currentSelection = SelectionStore.getSelection(),
          buildingName = currentSelection.name;
      var x = this.props.location.x;
      var y = this.props.location.y;
      this.props.player.city.addBuilding({
        building: new BuildingModel({
          name: buildingName,
          costs: [CityResource.construction(120)],
          generateResources: [CityResource.gold(1)],
          resourcesFrequency: 3,
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

export default Building;
