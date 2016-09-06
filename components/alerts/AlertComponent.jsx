var React = require('react');

var AlertDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  componentDidMount: function () {
    var id = this.props.id;
    var alert = document.getElementById(id);
    alert.addEventListener( 'transitionend', this._onTransitionEnd);
    setTimeout(function () {
      alert.className = 'alert rendered';
    },1000)
  },
  componentWillUnmount: function () {
    var alert = document.getElementById(this.props.id);
    alert.removeEventListener( 'transitionend', this._onTransitionEnd)
  },
  render: function() {
    return(
      <alert id={this.props.id} className='alert'>{this.props.message}</alert>
    )
  },
  _onTransitionEnd: function (element) {
    var alert = document.getElementById(this.props.id);
    // TODO - instead of hiding alert, consider removing it from DOM?
    alert.style.display = 'none';
  },
  _onClick: function () {

  }
});

export default AlertDisplay;
