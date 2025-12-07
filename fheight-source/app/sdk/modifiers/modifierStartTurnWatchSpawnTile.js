/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierStartTurnWatchSpawnEntity = require('./modifierStartTurnWatchSpawnEntity');
const UtilsPosition = require('app/common/utils/utils_position');

class ModifierStartTurnWatchSpawnTile extends ModifierStartTurnWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchSpawnTile";
    this.type ="ModifierStartTurnWatchSpawnTile";
  
    this.modifierName ="Turn Watch";
    this.description ="At the start of your turn, turn %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = "";
      if (UtilsPosition.getArraysOfPositionsAreEqual(modifierContextObject.spawnPattern, CONFIG.PATTERN_1x1)) {
        replaceText = "its space into "+modifierContextObject.spawnDescription;
      } else if (modifierContextObject.spawnCount === 1) {
        replaceText = "a nearby space into "+modifierContextObject.spawnDescription;
      } else if (modifierContextObject.spawnCount === 8) {
        replaceText = "all nearby spaces into "+modifierContextObject.spawnDescription;
      } else {
        replaceText = modifierContextObject.spawnCount+" nearby spaces into "+modifierContextObject.spawnDescription;
      }
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }
}
ModifierStartTurnWatchSpawnTile.initClass();

module.exports = ModifierStartTurnWatchSpawnTile;
