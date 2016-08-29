var ResourceJS = require('../_base/Resource.js');

var Resource = ResourceJS.Resource;

export class CityResource extends Resource {

  static types() {
    return [
      CityResource.kResourceGold,
      CityResource.kResourceWood,
    ];
  }

  static gold(amount) {
    return new CityResource(CityResource.kResourceGold, amount);
  }
  static wood(amount) {
    return new CityResource(CityResource.kResourceWood, amount);
  }
  static construction(amount) {
    return new CityResource(CityResource.kResourceConstruction, amount);
  }
}

CityResource.kResourceGold = 'gold';
CityResource.kResourceWood = 'wood';
CityResource.kResourceConstruction = 'construction';
