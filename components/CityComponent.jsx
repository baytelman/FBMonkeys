var React = require('react');

var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var Player = require('./PlayerComponent.jsx').default;
var Building = require('./BuildingComponent.jsx').default;

var City = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0, player: this.props.data, city:  this.props.data.city};
  },
  tick: function() {
    this.state.player.updateTime(1);
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    let rows = [];
    let size = 5;
    for (var y = -size; y <= size; y++) {
      let columns = [];
      for (var x = -size; x <= size; x++) {
        let building = this.state.city.buildingAtLocation(new SquareCoordinate(x, y));
        let bComponent = <Building data={building} />;
        columns.push(<td className="gridCell" key={'row' + x + '_col' + y}>{bComponent}</td>);
      }
      rows.push(<tr key={'col' + y}>{columns}</tr>);
    }
    return (
      <game>
        <table id={this.state.city.id}>
          <tbody>{rows}</tbody>
        </table>
        <Player data={this.state.player} />
      </game>
    );
  }
});

export default City;
