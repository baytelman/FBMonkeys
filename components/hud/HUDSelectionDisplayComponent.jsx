var React = require('react');

var CharacterMenuComponent = require('../menus/CharacterMenuComponent.jsx').default;
var BuildingMenuComponent  = require('../menus/BuildingMenuComponent.jsx').default;
var BuildMenuComponent     = require('../menus/BuildMenuComponent.jsx').default;
var CancelMenuComponent    = require('../menus/CancelMenuComponent.jsx').default;

var SelectionDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  getSelectedMenu: function () {
    if (this.props.selection.type === 'character') {
      return <CharacterMenuComponent selection={this.props.selection} />;
    } else if (this.props.selection.type === 'building') {
      return <BuildingMenuComponent selection={this.props.selection} />;
    } else if (this.props.selection.type === 'build') {
      return <BuildMenuComponent selection={this.props.selection} />;
    } else if (this.props.selection.type === 'buildingForPlacement') {
      return <CancelMenuComponent selection={this.props.selection} />;
    } else {
      return false;
    }
  },
  render: function() {
    var hasSelection = (this.props.selection.type === undefined) ? 'hud-window hidden' : 'hud-window';
    return(
      <div id='selection-display' className={hasSelection}>
        {this.getSelectedMenu()}
      </div>
    )
  }
});

export default SelectionDisplay;
