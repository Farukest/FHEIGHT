/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBackstabWatch = require('./modifierBackstabWatch');

class ModifierBackstabWatchApplyModifiersToTarget extends ModifierBackstabWatch {
  static initClass() {
  
    this.prototype.type ="ModifierBackstabWatchApplyModifiersToTarget";
    this.type ="ModifierBackstabWatchApplyModifiersToTarget";
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(modifiersContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onBackstabWatch(action) {

    const target = action.getTarget();
    if ((target != null) && (this.modifiersContextObjects != null)) {
      return (() => {
        const result = [];
        for (var modifier of Array.from(this.modifiersContextObjects)) {
          if (modifier != null) {
            result.push(this.getGameSession().applyModifierContextObject(modifier, target));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierBackstabWatchApplyModifiersToTarget.initClass();

module.exports = ModifierBackstabWatchApplyModifiersToTarget;
