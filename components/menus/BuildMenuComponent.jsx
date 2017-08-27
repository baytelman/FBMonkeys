const React = require('react');

const GameController = require('../../lib/controller/GameController.js').default;
const BuildingJS = require('../../lib/city/CityBuilding.js');
const BuildingConstructionAction = BuildingJS.BuildingConstructionAction

const availableBuildingActions = Object
  .values(GameController.instance.module.availableBuildings())
  .map((building) => new BuildingConstructionAction({building: building}));

var BuildMenu = React.createClass({
  render: function () {
    let _this = this;
    let controller = GameController.instance;
    let buildingComponents = availableBuildingActions.map(action => {
      let addBuilding = function () {
        action.executeForPlayer(controller.player);
      };
      if (!action.isAvailable(controller.player)) {
        return null;
      }
      const cost = action.cost(controller.player);
      const costsDescription = cost.length > 0 && "Cost:\n" + cost.map((c) => "[" + c.toString() + "]").join(" + ");
      const effectsDescription = action.building.effects.length > 0 && action
        .building
        .effects
        .map(e => "- " + e.getDescription())
        .join("\n");
      const permEffectsDescription = action.building.permanentEffects.length > 0 && action
        .building
        .permanentEffects
        .map(e => "- " + e.getDescription())
        .join("\n");
      const title = costsDescription + (effectsDescription
        ? ("\n⋯\nEffects:\n" + effectsDescription)
        : '') + (permEffectsDescription
        ? ("\n⋯\nEnablers:\n" + permEffectsDescription)
        : '');

      return (
        <button
          key={"btn_bld_" + action.building.id}
          disabled={!action.isAffordable(controller.player)}
          className='build-entity'
          onClick={addBuilding}
          title={title}>
          {action.building.name}
        </button>
      );
    });

    return (
      <div id='build-menu'>
        <b>Build</b>
        <div>
          {buildingComponents}
        </div>
      </div>
    )
  }
});

export default BuildMenu;
