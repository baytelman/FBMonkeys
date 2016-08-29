var React = require('react');

var AlertDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return(
      <div id='alert-display' className='hud-window'>
        <div className='alert-message'>Sample alert message...</div>
      </div>
    )
  }
});

export default AlertDisplay;
