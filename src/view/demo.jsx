var ResourceComponent= React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    return <resource>
    <type>{this.state.type}</type>
    <amount>{this.state.amount}</amount>
    </resource>;
  }
});

var PlayerComponent = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    let resources = Object.keys(this.state.resources).map(function(key) {
      return <ResourceComponent data={this.state.resources[key]} />;
    });
    return <player id={this.state.id}>
    <name>{this.state.name}</name>
    <time>{Math.round(this.state.time)}</time>
    <resources>
    {resources}
    </resources>
    </player>;
  }
});

var BuildingComponent = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    if (! this.state) {
      return <nothing> . </nothing>;
    }
    return <building id={this.state.id}>
    <name>{ this.state.name }</name>
    <status>{ this.state.isBuilt()?"Ready":Math.round(100 * this.state.buildProgress()) + "%" }</status>
    </building>
  }
});

var CityComponent = React.createClass({
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
        let bComponent = <BuildingComponent data={building} />;
        columns.push(<td className="gridCell" key={'row' + x + '_col' + y}>{bComponent}</td>);
      }
      rows.push(<tr key={'col' + y}>{columns}</tr>);
    }
    return (
      <game>
      <table id={this.state.city.id}><tbody>{rows}</tbody></table>
      <PlayerComponent data={this.state.player} />
      </game>
    );
  }
});

var renderDemo = function() {
  let player = new CityPlayer();
  player.city.addBuilding({
    building: new Building({
      name: "Gold Mine",
      buildTime: 30
    }),
    location: new SquareCoordinate(0,-1)
  });
  player.city.addBuilding({
    building: new Building({
      name: "Barracks",
      buildTime: 120
    }),
    location: new SquareCoordinate(1,0)
  });

  let component = <CityComponent data={player} />;
  ReactDOM.render(component, document.getElementById('demo'));
};
