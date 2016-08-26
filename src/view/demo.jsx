var ResourceComponent= React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    return <resource>
    <type>{this.props.data.type}</type>
    <amount>{this.props.data.amount}</amount>
    </resource>;
  }
});

var PlayerComponent = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    let resources = this.props.data.resources;
    let resourcesComponents = Object.keys(resources).map(function(key) {
      return <ResourceComponent key={key} data={ new Resource(key, resources[key]) } />;
    });
    return <player id={this.state.id}>
    <name>{this.state.name}</name>
    <time>{Math.round(this.state.time)}</time>
    <resources>
    {resourcesComponents}
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
    <status>{ this.state.isCompleted()?"Ready":Math.round(100 * this.state.progress()) + "%" }</status>
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
      costs: [CityResource.construction(120)],
      generateResources: [CityResource.gold(1)],
      resourcesFrequency: 3,
    }),
    location: new SquareCoordinate(0,-1)
  });
  player.city.addBuilding({
    building: new Building({
      name: "Barracks",
      costs: [CityResource.construction(90)],
    }),
    location: new SquareCoordinate(1,0)
  });
  player.city.addBuilding({
    building: new Building({
      name: "Farm",
      costs: [CityResource.construction(60)],
      generateResources: [CityResource.human(1)],
      resourcesFrequency: 10,
    }),
    location: new SquareCoordinate(-1,0)
  });

  let component = <CityComponent data={player} />;
  ReactDOM.render(component, document.getElementById('demo'));
};
