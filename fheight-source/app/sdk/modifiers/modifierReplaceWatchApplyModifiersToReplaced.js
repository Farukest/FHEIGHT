/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierReplaceWatch = require('./modifierReplaceWatch');

class ModifierReplaceWatchApplyModifiersToReplaced extends ModifierReplaceWatch {
  static initClass() {
  
    this.prototype.type ="ModifierReplaceWatchApplyModifiersToReplaced";
    this.type ="ModifierReplaceWatchApplyModifiersToReplaced";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierReplaceWatch"];
  
    this.prototype.modifierContextObjects = null;
  }

  static createContextObject(modifierContextObjects, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifierContextObjects = modifierContextObjects;
    return contextObject;
  }

  onReplaceWatch(action) {
    const card = action.getReplacedCard();
    if (this.modifierContextObjects != null) {
      return (() => {
        const result = [];
        for (var modifierContextObject of Array.from(this.modifierContextObjects)) {
          if (modifierContextObject != null) {
            result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, card));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierReplaceWatchApplyModifiersToReplaced.initClass();

module.exports = ModifierReplaceWatchApplyModifiersToReplaced;
