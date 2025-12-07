/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchApplyModifiers = require('./modifierSummonWatchApplyModifiers');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSummonWatchNearbyApplyModifiers extends ModifierSummonWatchApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchNearbyApplyModifiers";
    this.type ="ModifierSummonWatchNearbyApplyModifiers";
  
    this.description = "Friendly minions summoned nearby this minion %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, buffDescription, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.buffDescription = buffDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.buffDescription);
    } else {
      return this.description;
    }
  }

  getIsValidBuffPosition(summonedUnitPosition) {
    const entityPosition = this.getCard().getPosition();
    if ((Math.abs(summonedUnitPosition.x - entityPosition.x) <= 1) && (Math.abs(summonedUnitPosition.y - entityPosition.y) <= 1)) {
      return true;
    } else {
      return false;
    }
  }
}
ModifierSummonWatchNearbyApplyModifiers.initClass();


module.exports = ModifierSummonWatchNearbyApplyModifiers;
