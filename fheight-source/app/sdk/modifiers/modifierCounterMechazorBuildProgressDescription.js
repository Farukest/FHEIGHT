/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

const i18next = require('i18next');

class ModifierCounterMechazorBuildProgressDescription extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCounterMechazorBuildProgressDescription";
    this.type ="ModifierCounterMechazorBuildProgressDescription";
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(percentComplete) {
    const contextObject = super.createContextObject();
    contextObject.percentComplete = percentComplete;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return i18next.t("modifiers.mechazor_counter_applied_desc",{percent_complete: modifierContextObject.percentComplete});
    }
  }
}
ModifierCounterMechazorBuildProgressDescription.initClass();

module.exports = ModifierCounterMechazorBuildProgressDescription;
