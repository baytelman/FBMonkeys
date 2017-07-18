const React = require('react');

const Player = require('./PlayerComponent.jsx').default;

let freq = 0.05;

var City = React.createClass({
  tick: function() {
    this.props.controller.tick(freq);
    this.forceUpdate();
  },
  componentDidMount: function () {
    this.interval = setInterval(this.tick, 1000*freq);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function () {
    return (
      <game id='game'>
        <Player player={this.props.player}/>
      </game>
    );
  },
});

export default City;
