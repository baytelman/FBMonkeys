const React = require('react');

const SelectionActions = require('../../actions/SelectionActions.js');
const PlayerActions = require('../../actions/PlayerActions.js');

var ControlPanel = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return(
      <div id='control-panel' className='hud-window'>
        <ul>
          <li>
            <button id='toggle-building-menu' onClick={this._onBuildingMenuClick}>Build</button>
          </li>
        </ul>
      </div>
    )
  },
  _onBuildingMenuClick: function (event) {
    if (this.props.mode === 'placing') {
      PlayerActions.setMode('normal');
    }
    var data = {
      type: 'build',
      list: 'basic'
    }
    SelectionActions.setSelection(data);
  }
});

export default ControlPanel;
