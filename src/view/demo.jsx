
var BuildingComponent = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    return <building id={this.state.id}>{this.state.name}</building>
  }
});

var CityComponent = React.createClass({
  getInitialState: function() {
    return {city:  this.props.data.city};
  },
  render: function() {
    let rows = [];
    let size = 5;
    for (var y = -size; y <= size; y++) {
      let columns = [];
      for (var x = -size; x <= size; x++) {
        let building = this.state.city.buildingAtLocation(new SquareCoordinate(x, y));
        let bComponent = (building && <BuildingComponent data={building} />) || <nothing>Nothing</nothing>;
        columns.push(<td key={'row' + x + '_col' + y}>{bComponent}</td>);
      }
      rows.push(<tr key={'col' + y}>{columns}</tr>);
    }
    return (
      <table id={this.state.city.id}><tbody>{rows}</tbody></table>
    );
  }
});

var renderDemo = function() {
  let component = <CityComponent data={new CityPlayer()} />;
  ReactDOM.render(component, document.getElementById('demo'));
};
