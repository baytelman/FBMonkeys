const City = require('./City.js').default;
const {CityResource, ResourceEffect} = require('./CityResource.js');
const CityBuilding = require("./CityBuilding.js").default;
const {BuildingStoreResourceEffect, CollectBuildingResourcesEffect, ResourceStoringModifierEffect} = require("./CityBuilding.js");

const FrequencyEffect = require('./Effect.js').FrequencyEffect;
const {CityPlayer, PlayerEarnResourceEffect, CapacityGrantingEffect} = require("./CityPlayer.js");

const CityCharacter = require("./CityCharacter.js").default;
const {CharacterConsumeResourceOrGetsRemovedEffect} = require("./CityCharacter.js");

const CityResearchProject = require('./CityResearchProject.js').default;
const {PlayerEarnResearchEffect} = require('./CityResearchProject.js');

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
    let secondPass = false;
    const parseAndRecreateHierarchy = (k, v) => {
      if (v && v.id && !v["class"] && (secondPass || knownObjects[v.id])) {
        if (!knownObjects[v.id]) {
          throw new Error("Should know object '" + v.id);
        }
        return knownObjects[v.id];
      } else if (v && v.id && v["class"]) {
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
    };
    /* First pass, to discover all objects. */
    /* We might encounter a simplified object (only id) we don't know yet */
    JSON.parse(string, parseAndRecreateHierarchy);
    /* Second pass, return the hierarchy with all known objects */
    secondPass = true;
    return JSON.parse(string, parseAndRecreateHierarchy);
  }
}
