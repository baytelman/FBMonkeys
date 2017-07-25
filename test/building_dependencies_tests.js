import {assert} from 'chai'
import {CityResource} from '../lib/city/CityResource';
import {Building, BuildingConstructionAction} from '../lib/city/Building';
import {CityPlayer} from '../lib/city/CityPlayer';

const gold = (amount) => new CityResource('gold', amount);

describe('Buildings Dependencies', () => {
  let resource = gold(100);
  
  it('can become available', () => {
    let resources = [resource];
    let time = 10;
    let building1 = new Building();
    let building2 = new Building({
      requirements: [building1.namespace]
    });
    let player = new CityPlayer();
    
    let action = new BuildingConstructionAction({building: building2});
    assert.isFalse(action.isAvailable(player));
    
    player.city.planBuilding({
      building: building1
    });
    
    player.updateTime(building1.buildingTime);
    assert.isTrue(action.isAvailable(player));
    
  });
});
