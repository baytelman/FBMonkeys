var EffectJS = require('../../lib/_base/Effect.js');
var EnableResourceEffect = EffectJS.EnableResourceEffect;
var CityResource = require('../../lib/city/CityResource.js').CityResource;
var CityPlayer = require('../../lib/city/CityPlayer.js').CityPlayer;

export class CityTestUtilities {

  static enabledCityPlayer(city, type, maxResource) {
    if (!type) {
      type = CityResource.kResourceGold;
    }
    if (!maxResource) {
      maxResource = CityTestUtilities.maxResourceDefault;
    }
    let values = {
      name: "Name",
      effects: [
        new EnableResourceEffect({
          type: type,
          amount: maxResource
        })
      ]
    };
    if (city) {
      values.city = city;
    }
    return new CityPlayer(values);
  }
}

CityTestUtilities.maxResourceDefault = 1000;
