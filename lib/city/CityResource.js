var ResourceJS = require('../_base/Resource.js');

var Resource = ResourceJS.Resource;

export class CityResource extends Resource {

  static types() {
    return [
      CityResource.kResourceHuman,
      CityResource.kResourceGold,
    ];
  }

  static gold(amount) {
    return new CityResource(CityResource.kResourceGold, amount);
  }
  static human(amount) {
    return new CityResource(CityResource.kResourceHuman, amount);
  }
  static construction(amount) {
    return new CityResource(CityResource.kResourceConstruction, amount);
  }
}

CityResource.kResourceGold = 'gold';
CityResource.kResourceHuman = 'human';
CityResource.kResourceConstruction = 'construction';
