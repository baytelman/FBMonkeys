var CitySerializer = require("../city/CitySerializer.js").CitySerializer;
var CityPlayer = require('../city/CityPlayer.js').CityPlayer;
var CharacterOperationJS = require("./CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;

export class GameController {
  constructor() {
    this.module = GameModule();
    this.player = null;
  }
  startNewGame() {
    this.player = new CityPlayer();
    this.player.addCharacter(this.module.createNewCharacter());
    this.player.addCharacter(this.module.createNewCharacter());
    this.player.addCharacter(this.module.createNewCharacter());
  }

  listMyCharacters() {
    return JSON.parse(CitySerializer.serialize(this.player.characters));
  }

  listMyBuilding() {
    return JSON.parse(CitySerializer.serialize(this.player.city.buildings));
  }
}

export class GameModule {
  constructor() {
    this.buildings = [];
    this.charactersSkills = [];
  }
  createNewCharacter() {
    let skillLevel = {};
    /* Good skills = 1/5 */
    while (skillLevel.length < this.charactersSkills.length/15) {
      let skill = this.charactersSkills[Math.floor(Math.random()*this.charactersSkills.length)];
      /* If already skilled, skip */
      if (skillLevel[skill.id]) {
        continue;
      }
      skillLevel[skill.id] = 3;

    }
    return new CityCharacter({
      
    });
  }
}
