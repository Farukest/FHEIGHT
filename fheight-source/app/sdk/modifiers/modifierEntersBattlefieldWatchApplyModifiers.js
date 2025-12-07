/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEntersBattlefieldWatch = require('./modifierEntersBattlefieldWatch');

class ModifierEntersBattlefieldWatchApplyModifiers extends ModifierEntersBattlefieldWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEntersBattlefieldWatchApplyModifiers";
    this.type ="ModifierEntersBattlefieldWatchApplyModifiers";
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(modifiersContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onEntersBattlefield() {

    if (this.modifiersContextObjects != null) {
      return (() => {
        const result = [];
        for (var modifiersContextObject of Array.from(this.modifiersContextObjects)) {
          if (modifiersContextObject != null) {
            result.push(this.getGameSession().applyModifierContextObject(modifiersContextObject, this.getCard()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierEntersBattlefieldWatchApplyModifiers.initClass();

module.exports = ModifierEntersBattlefieldWatchApplyModifiers;
