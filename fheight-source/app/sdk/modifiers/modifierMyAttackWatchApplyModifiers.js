/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');

class ModifierMyAttackWatchApplyModifiers extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchApplyModifiers";
    this.type ="ModifierMyAttackWatchApplyModifiers";
  
    this.prototype.modifiersContextObjects = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onMyAttackWatch(action) {

    if (this.modifiersContextObjects != null) {
      return (() => {
        const result = [];
        for (var modifier of Array.from(this.modifiersContextObjects)) {
          if (modifier != null) {
            result.push(this.getGameSession().applyModifierContextObject(modifier, this.getCard()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierMyAttackWatchApplyModifiers.initClass();

module.exports = ModifierMyAttackWatchApplyModifiers;
