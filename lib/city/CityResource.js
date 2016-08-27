var ResourceJS = require('../_base/Resource.js');

var Resource = ResourceJS.Resource;

const kResourceGold = 'gold';
const kResourceHuman = 'human';
const kResourceConstruction = 'construction';

export class CityResource extends Resource {

  static types() {
    return [
      kResourceHuman,
      kResourceGold,
    ];
  }

  static gold(amount) {
    return new Resource(kResourceGold, amount);
  }
  static human(amount) {
    return new Resource(kResourceHuman, amount);
  }
  static construction(amount) {
    return new Resource(kResourceConstruction, amount);
  }
}
