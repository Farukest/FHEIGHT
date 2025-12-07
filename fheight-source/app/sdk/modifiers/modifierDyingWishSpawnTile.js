/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierDyingWishSpawnEntity = require('./modifierDyingWishSpawnEntity');

class ModifierDyingWishSpawnTile extends ModifierDyingWishSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishSpawnTile";
    this.type ="ModifierDyingWishSpawnTile";
  
    this.description = "Turn %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = "";
      if (UtilsPosition.getArraysOfPositionsAreEqual(modifierContextObject.spawnPattern, CONFIG.PATTERN_1x1)) {
        replaceText = "this space into "+modifierContextObject.spawnDescription;
      } else if (modifierContextObject.spawnCount === 1) {
        replaceText = "a "+modifierContextObject.spawnDescription+" in a random nearby space";
      } else if (modifierContextObject.spawnCount === 8) {
        replaceText = ""+modifierContextObject.spawnDescription+"s in all nearby spaces";
      } else {
        replaceText = ""+modifierContextObject.spawnDescription+"s into "+modifierContextObject.spawnCount+" nearby spaces";
      }
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }
}
ModifierDyingWishSpawnTile.initClass();

module.exports = ModifierDyingWishSpawnTile;
