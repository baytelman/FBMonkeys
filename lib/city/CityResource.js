var ResourceJS = require('../_base/Resource.js');

var Resource = ResourceJS.Resource;

const kResourceGold = 'gold';
const kResourceHuman = 'human';

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
}
