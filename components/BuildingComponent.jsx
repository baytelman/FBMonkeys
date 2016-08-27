var React = require('react');

var Building = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    if (! this.state) {
      return <nothing> . </nothing>;
    }
    return(
      <building id={this.state.id}>
        <name>{ this.state.name }</name>
        <status>{ this.state.isBuilt()?"Ready":Math.round(100 * this.state.buildProgress()) + "%" }</status>
      </building>
    )
  }
});

export default Building;
