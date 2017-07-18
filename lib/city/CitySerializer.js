
const CityPlayer = require('./CityPlayer.js').default;
const City = require('./City.js').default;
const CityResource = require('./CityResource.js').CityResource;
const Building = require('./Building.js').Building;
const PlayerEarnResourceEffect = require("../city/CityPlayer.js").PlayerEarnResourceEffect;

export default class CitySerializer {
  static serialize(obj) {
    return JSON.stringify(obj, (k, v) => {
      if (v && v.constructor && v.id) {
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
        let class_ = eval(v["class"]);
        if (class_) {
          let o = Object.assign(Object.create(class_.prototype), v);
          knownObjects[v.id] = o;
          return o;
        } else {
          throw new Error("Cannot deserialize class '" + v["class"] + "'");
        }
      }
      return v;
    });
  }
}
