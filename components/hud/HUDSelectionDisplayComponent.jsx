var React = require('react');

var CharacterMenu = require('../menus/CharacterMenuComponent.jsx').default;
var BuildingMenu  = require('../menus/BuildingMenuComponent.jsx').default;
var BuildMenu     = require('../menus/BuildMenuComponent.jsx').default;
var CancelMenu    = require('../menus/CancelMenuComponent.jsx').default;

var SelectionDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  getSelectedMenu: function () {
    if (this.props.selection.type === 'character') {
      return <CharacterMenu selection={this.props.selection} />;
    } else if (this.props.selection.type === 'building') {
      return <BuildingMenu selection={this.props.selection} />;
    } else if (this.props.selection.type === 'build') {
      return <BuildMenu selection={this.props.selection} />;
    } else if (this.props.selection.type === 'buildingForPlacement') {
      return <CancelMenu selection={this.props.selection} />;
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
