var React = require('react');

var SelectionActions = require('../../actions/SelectionActions.js');
var PlayerActions = require('../../actions/PlayerActions.js');

var CancelMenu = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return(
      <div id='cancel-menu'>
        <button onClick={this._onClick}>✗<span className='cancel-msg'>(Cancel {this.props.selection.name})</span></button>
      </div>
    )
  },
  _onClick: function () {
    event.stopPropagation();
    PlayerActions.setMode('normal');
    SelectionActions.setSelection({});
  }
});

export default CancelMenu;
