/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierEndTurnWatchSpawnEntity = require('./modifierEndTurnWatchSpawnEntity');
const UtilsPosition = require('app/common/utils/utils_position');

class ModifierEndTurnWatchSpawnTile extends ModifierEndTurnWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchSpawnTile";
    this.type ="ModifierEndTurnWatchSpawnTile";
  
    this.modifierName ="Turn Watch";
    this.description ="At the end of your turn, turn %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericSpawn"];
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
ModifierEndTurnWatchSpawnTile.initClass();

module.exports = ModifierEndTurnWatchSpawnTile;
