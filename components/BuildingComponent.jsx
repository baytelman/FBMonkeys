var React = require('react');

var Building = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    if (! this.state) {
      return <nothing> . </nothing>;
    }
    var initial = this.state.name.substr(0,1) ;
    var classname = 'building building-type-'+this.state.name;
    return(
      <building className={classname} id={this.state.id}>
        <name>{ initial }</name>
        <status>{ this.state.isCompleted()?"Ready":Math.round(100 * this.state.progress()) + "%" }</status>
      </building>
    )
  }
});

export default Building;
