
const EffectJS = require('../_base/Effect.js');

const CityPlayer = require('./CityPlayer.js').CityPlayer;
const City = require('./City.js').City;
const CityResource = require('./CityResource.js').CityResource;
const CharacterOperationJS = require("./CharacterOperation.js");
const CityCharacter = CharacterOperationJS.CityCharacter;

const BuildingJS = require('./Building.js');
const Building = BuildingJS.Building;
const CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

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
