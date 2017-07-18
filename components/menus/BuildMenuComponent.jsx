const React = require('react');

const GameController = require('../../lib/controller/GameController.js').default;
const BuildingJS = require('../../lib/city/Building.js');
const BuildingConstructionAction = BuildingJS.BuildingConstructionAction

var BuildMenu = React.createClass({
  render: function() {
    let _this = this;
    let controller = GameController.instance;
    let buildingComponents = Object.values(controller.module.availableBuildings()).map((building) => {
      let action = new BuildingConstructionAction({
        building: building,
      });
      let addBuilding = function() {
        action.executeForPlayer(controller.player);
      };
      if (! action.isAvailable(controller.player)) {
        return null;
      }
      if (action.isAffordable(controller.player)) {
        return (<button key={ "btn_bld_" + building.id } className='build-entity' onClick={ addBuilding }>{ building.name }</button>);
      } else {
        return (<span key={ "btn_bld_dis_" + building.id }>({ building.name })</span>);
      }
    });

    return(
      <div id='build-menu'>
        <ul>
          <li>
          { buildingComponents }
          </li>
        </ul>
      </div>
    )
  }
});

export default BuildMenu;
