var React = require('react');

var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;
var BuildingJS = require('../lib/city/Building.js');
var BuildingModel = BuildingJS.Building;
var CityResourceJS = require('../lib/city/CityResource.js');
var CityResource = CityResourceJS.CityResource;

var SelectionActions = require('../actions/SelectionActions.js');
var PlayerActions = require('../actions/PlayerActions.js');
var AlertActions = require("../actions/AlertActions.js");

var Tile = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    var hoverStateClass = (this.props.mode === 'placing') ? ' cell-placement-hover-state' : '';
    if (this.props.character) {
      var characterClassName = 'entity character-entity char-' + this.props.character.name + hoverStateClass;
      return (
        <characterentity className={characterClassName} onClick={this._onCharacterClick}>
          <span>{this.props.character.name}</span>
        </characterentity>
      )
    }
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
  },
  _onCharacterClick: function (event) {
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
});

export default Tile;
