/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchNearbyApplyModifiers = require('./modifierSummonWatchApplyModifiers');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSummonWatchNearbyApplyModifiersOncePerTurn extends ModifierSummonWatchNearbyApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchNearbyApplyModifiersOncePerTurn";
    this.type ="ModifierSummonWatchNearbyApplyModifiersOncePerTurn";
  
    this.description = "The first friendly minion summoned nearby this minion each turn %X";
  
    this.prototype.canApplyModifier = true; // can apply modifier once per turn
  
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
    if (this.canApplyModifier) {
      const entityPosition = this.getCard().getPosition();
      if ((Math.abs(summonedUnitPosition.x - entityPosition.x) <= 1) && (Math.abs(summonedUnitPosition.y - entityPosition.y) <= 1)) {
        this.canApplyModifier = false;
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  onStartTurn(actionEvent) {
    super.onStartTurn(actionEvent);
    return this.canApplyModifier = true;
  }
}
ModifierSummonWatchNearbyApplyModifiersOncePerTurn.initClass();


module.exports = ModifierSummonWatchNearbyApplyModifiersOncePerTurn;
