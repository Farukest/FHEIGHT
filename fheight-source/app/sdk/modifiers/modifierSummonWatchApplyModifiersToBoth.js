/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');

class ModifierSummonWatchApplyModifiersToBoth extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchApplyModifiersToBoth";
    this.type ="ModifierSummonWatchApplyModifiersToBoth";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, buffDescription, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.buffDescription = buffDescription;
    return contextObject;
  }

  onSummonWatch(action) {

    if (this.modifiersContextObjects != null) {
      const summonedUnitPosition = __guard__(action.getTarget(), x => x.getPosition());
      if (this.getIsValidBuffPosition(summonedUnitPosition)) {

        let modifierContextObject;
        for (modifierContextObject of Array.from(this.modifiersContextObjects)) {
          this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
        }
          
        const entity = action.getTarget();
        if (entity != null) {
          return (() => {
            const result = [];
            for (modifierContextObject of Array.from(this.modifiersContextObjects)) {
              result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
            }
            return result;
          })();
        }
      }
    }
  }

  getIsValidBuffPosition(summonedUnitPosition) {
    // override this in subclass to filter by position
    return true;
  }
}
ModifierSummonWatchApplyModifiersToBoth.initClass();

module.exports = ModifierSummonWatchApplyModifiersToBoth;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}