var ResourceJS = require('../_base/Resource.js');

var Resource = ResourceJS.Resource;

export class CityResource extends Resource {

  static types() {
    return [
      CityResource.kResourceHuman,
      CityResource.kResourceWood,
      CityResource.kResourceGold,
      CityResource.kResourceConstruction
    ];
  }


  static human(amount) {
    return new CityResource(CityResource.kResourceHuman, amount);
  }
  static wood(amount) {
    return new CityResource(CityResource.kResourceWood, amount);
  }
  static gold(amount) {
    return new CityResource(CityResource.kResourceGold, amount);
  }
  static construction(amount) {
    return new CityResource(CityResource.kResourceConstruction, amount);
  }
}

CityResource.kResourceHuman = 'human';
CityResource.kResourceWood = 'wood';
CityResource.kResourceGold = 'gold';
CityResource.kResourceConstruction = 'construction';
