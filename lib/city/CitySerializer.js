const City = require('./City.js').default;
const CityResource = require('./CityResource.js').CityResource;
const Building = require('./Building.js').Building;

const FrequencyEffect = require('./Effect.js').FrequencyEffect;
const CityPlayer = require('./CityPlayer.js').CityPlayer;
const PlayerEarnResourceEffect = require("./CityPlayer.js").PlayerEarnResourceEffect;
const BuildingStoreResourceEffect = require("./CityPlayer.js").BuildingStoreResourceEffect;
const CapacityGrantingEffect = require("./CityPlayer.js").CapacityGrantingEffect;

const CityCharacter = require("./CityCharacter.js").CityCharacter;

export default class CitySerializer {
  static serialize(obj) {
    let alreadySerialized = {};
    return JSON.stringify(obj, (k, v) => {
      if (v && v.constructor && v.id) {
        if (alreadySerialized[v.id]) {
          return {id: v.id};
        }
        alreadySerialized[v.id] = true;
        return Object.assign({
          "class": v.constructor.name
        }, v);
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
        try {
          let class_ = eval(v["class"]);
          let o = Object.assign(Object.create(class_.prototype), v);
          knownObjects[v.id] = o;
          return o;
        } catch (error) {
          throw new Error("Cannot deserialize class '" + v["class"] + "': " + error);
        }
      }
      return v;
    });
  }
}
