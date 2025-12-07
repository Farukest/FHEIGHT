/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchAnyPlayer = require('./modifierSummonWatchAnyPlayer');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSummonWatchAnyPlayerApplyModifiers extends ModifierSummonWatchAnyPlayer {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchAnyPlayerApplyModifiers";
    this.type ="ModifierSummonWatchAnyPlayerApplyModifiers";
  
    this.description = "Other minions you summon %X";
  
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

  onSummonWatch(action) {
    const summonedUnitPosition = __guard__(action.getTarget(), x => x.getPosition());

    if ((this.modifiersContextObjects != null) && this.getIsValidBuffPosition(summonedUnitPosition)) {
      const entity = action.getTarget();
      if (entity != null) {
        return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
      }
    }
  }

  getIsValidBuffPosition(summonedUnitPosition) {
    // override this in subclass to filter by position
    return true;
  }
}
ModifierSummonWatchAnyPlayerApplyModifiers.initClass();

module.exports = ModifierSummonWatchAnyPlayerApplyModifiers;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}