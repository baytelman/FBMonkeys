var React = require('react');

var SelectionActions = require('../../actions/SelectionActions.js');
var PlayerActions = require('../../actions/PlayerActions.js');

var BuildMenu = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return(
      <div id='build-menu'>
        <ul>
          <li>
            <button className='build-entity' onClick={this._onBuildClick}>Shipyard</button>
            <button className='build-entity' onClick={this._onBuildClick}>Starport</button>
            <button className='build-entity' onClick={this._onBuildClick}>Hospital</button>
            <button className='build-entity' onClick={this._onBuildClick}>Bunker</button>
            <button className='build-entity' onClick={this._onBuildClick}>Scout Tower</button>
            <button className='build-entity' onClick={this._onBuildClick}>Recreation Center</button>
            <button className='build-entity' onClick={this._onBuildClick}>Dining Hall</button>
            <button className='build-entity' onClick={this._onBuildClick}>House</button>
          </li>
        </ul>
      </div>
    )
  },
  _onBuildClick: function (event) {
    var buildingName = event.target.innerHTML;
    PlayerActions.setMode('placing');
    var data = {
      type: 'buildingForPlacement',
      name: buildingName
    };
    SelectionActions.setSelection(data);
    // Generate random x/y coords between -10 and 10
    // var x = Math.floor(Math.random()*21)-10;
    // var y = Math.floor(Math.random()*21)-10;
    // player.city.addBuilding({
    //   building: new Building({
    //     name: buildingName,
    //     costs: [CityResource.construction(120)],
    //   }),
    //   location: new SquareCoordinate(x,y)
    // });
  }
});

export default BuildMenu;
