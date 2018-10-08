import City from './City';
import { CityResource } from './CityResource';
import CityBuilding from './CityBuilding';
import {
  BuildingStoreResourceEffect,
  CollectBuildingResourcesEffect,
  ResourceStoringModifierEffect
} from './CityBuilding';

import {
  PeriodicEffect,
  ResourceEffect,
  SpeedEnhancementEffect
} from './Effect';
import CityPlayer, {
  PlayerEarnResourceEffect,
  CapacityGrantingEffect
} from './CityPlayer';

import CityCharacter, {
  CharacterConsumeResourceOrGetsRemovedEffect
} from './CityCharacter';

import CityResearchProject from './CityResearchProject';
import { PlayerEarnResearchEffect } from './CityResearchProject';

const KNOWN_CLASSES = {
  BuildingStoreResourceEffect: BuildingStoreResourceEffect,
  CapacityGrantingEffect: CapacityGrantingEffect,
  CharacterConsumeResourceOrGetsRemovedEffect: CharacterConsumeResourceOrGetsRemovedEffect,
  City: City,
  CityBuilding: CityBuilding,
  CityCharacter: CityCharacter,
  CityPlayer: CityPlayer,
  CityResearchProject: CityResearchProject,
  CityResource: CityResource,
  CollectBuildingResourcesEffect: CollectBuildingResourcesEffect,
  PeriodicEffect: PeriodicEffect,
  PlayerEarnResearchEffect: PlayerEarnResearchEffect,
  PlayerEarnResourceEffect: PlayerEarnResourceEffect,
  ResourceEffect: ResourceEffect,
  ResourceStoringModifierEffect: ResourceStoringModifierEffect,
  SpeedEnhancementEffect: SpeedEnhancementEffect
};

export default class CitySerializer {
  static serialize(obj) {
    let alreadySerialized = {};
    const map = (k, v) => {
      if (v && v.constructor && v.id) {
        if (alreadySerialized[v.id]) {
          return { id: v.id };
        }
        alreadySerialized[v.id] = true;
        return Object.assign(
          {
            class: v.constructor.name
          },
          v
        );
      }
      return v;
    };
    return JSON.stringify(obj, map, '  ');
  }

  static deserialize(string) {
    let knownObjects = {};
    let secondPass = false;
    const parseAndRecreateHierarchy = (k, v) => {
      if (v && v.id && !v['class'] && (secondPass || knownObjects[v.id])) {
        if (!knownObjects[v.id]) {
          throw new Error("Should know object '" + v.id);
        }
        return knownObjects[v.id];
      } else if (v && v.id && v['class']) {
        let class_ = KNOWN_CLASSES[v['class']];
        if (!class_) {
          throw new Error(
            `Cannot deserializer class: ${
              v['class']
            }. Known classes: ${Object.keys(KNOWN_CLASSES).join(', ')}`
          );
        }
        let o = Object.assign(Object.create(class_.prototype), v);
        knownObjects[v.id] = o;
        return o;
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

  static registerKnownClass = klass => {
    KNOWN_CLASSES[klass.name] = klass;
  };
}
