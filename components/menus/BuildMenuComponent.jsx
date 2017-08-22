const React = require('react');

const GameController = require('../../lib/controller/GameController.js').default;
const BuildingJS = require('../../lib/city/CityBuilding.js');
const BuildingConstructionAction = BuildingJS.BuildingConstructionAction

var BuildMenu = React.createClass({
  render: function () {
    let _this = this;
    let controller = GameController.instance;
    let buildingComponents = Object
      .values(controller.module.availableBuildings())
      .map((building) => {
        let action = new BuildingConstructionAction({building: building});
        let addBuilding = function () {
          action.executeForPlayer(controller.player);
        };
        if (!action.isAvailable(controller.player)) {
          return null;
        }
        const cost = action.cost(controller.player);
        const costsDescription = cost.length > 0 && "Cost:\n" + cost.map((c) => "[" + c.toString() + "]").join(" + ");
        const effectsDescription = building.effects.length > 0 && building
          .effects
          .map((c) => "- " + c.getDescription())
          .join("\n");
        const title = costsDescription + (effectsDescription
          ? ("\n⋯\nEffects:\n" + effectsDescription)
          : '');

        return (
          <button
            key={"btn_bld_" + building.id}
            disabled={!action.isAffordable(controller.player)}
            className='build-entity'
            onClick={addBuilding}
            title={title}>
            {building.name}
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
