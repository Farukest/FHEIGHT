/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchFromActionBarAnyPlayer = require('./modifierSummonWatchFromActionBarAnyPlayer');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers extends ModifierSummonWatchFromActionBarAnyPlayer {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers";
    this.type ="ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers";
  
    this.description = "All minions summoned from the action bar %X";
  
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
ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers.initClass();

module.exports = ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}