var React = require('react');

var Alert = require('../alerts/AlertComponent.jsx').default;

var AlertStore = require('../../stores/AlertStore.js').default;

function getAlertsState () {
  return AlertStore.getAlerts();
}

var AlertDisplay = React.createClass({
  getInitialState: function() {
    return {
      alerts: getAlertsState()
    }
  },
  updateState: function() {
    this.setState({
      alerts: getAlertsState()
    });
  },
  componentWillMount: function () {
    AlertStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    AlertStore.removeListener("change", this._onChange);
  },
  componentDidMount: function () {
    var lastAlert = document.body.querySelector('.alert:last-of-type');
  },
  buildChildren: function (alert) {
    return(
      <Alert key={alert.id} id={alert.id} className='alert' message={alert.message} />
    )
  },
  render: function() {
    var alerts = this.state.alerts;
    return(
      <div id='alert-display' className='hud-window'>
        <div className='alerts'>{alerts.map(this.buildChildren)}</div>
      </div>
    )
  },
  _onChange: function () {

  }
});

export default AlertDisplay;
