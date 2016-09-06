var React = require('react');

var BuildingMenu = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return(
      <div id='building-menu'>
        <div>Building Name: {this.props.selection.data.name}</div>
        <div>Building Status: { this.props.selection.data.isCompleted()?"Ready":Math.round(100 * this.props.selection.data.progress()) + "%" }</div>
      </div>
    )
  }
});

export default BuildingMenu;
