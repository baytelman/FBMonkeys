
var EffectJS = require('../_base/Effect.js');
var EnableResourceEffect = EffectJS.EnableResourceEffect;

var CityPlayer = require('./CityPlayer.js').CityPlayer;
var City = require('./City.js').City;
var CityResource = require('./CityResource.js').CityResource;
var CharacterOperationJS = require("./CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;

var BuildingJS = require('./Building.js');
var Building = BuildingJS.Building;
var CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

export class CitySerializer {
  static serialize(obj) {
    return JSON.stringify(obj, (k, v) => {
      if (v.constructor && v.id) {
        return Object.assign({"class":v.constructor.name}, v);
      }
      return v;
    }, '  ');
  }
  static deserialize(string) {
    let knownObjects = {}
    return JSON.parse(string, (k, v) => {
      if (knownObjects[v.id]) {
        return knownObjects[v.id];
      }
      if (v["class"] && v.id) {
        let o = Object.assign(Object.create(eval(v["class"]).prototype), v);
        knownObjects[v.id] = o;
        return o;
      }
      return v;
    });
  }
}
