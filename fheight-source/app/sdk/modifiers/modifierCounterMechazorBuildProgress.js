/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCounter = require('./modifierCounter');
const ModifierCounterMechazorBuildProgressDescription = require('./modifierCounterMechazorBuildProgressDescription');

const i18next = require('i18next');

/*
  Counts current progress towards mechaz0r build
*/
class ModifierCounterMechazorBuildProgress extends ModifierCounter {
  static initClass() {
  
    this.prototype.type ="ModifierCounterMechazorBuildProgress";
    this.type ="ModifierCounterMechazorBuildProgress";
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(mechazorProgressType, mechazorsBuiltType) {
    const contextObject = super.createContextObject();
    contextObject.mechazorProgressType = mechazorProgressType;
    contextObject.mechazorsBuiltType = mechazorsBuiltType;
    return contextObject;
  }

  getModifierContextObjectToApply() {
    const modContextObject = ModifierCounterMechazorBuildProgressDescription.createContextObject(this.getCurrentCount());
    modContextObject.appliedName = i18next.t("modifiers.mechazor_counter_applied_name");

    return modContextObject;
  }

  getCurrentCount() {
    const modifierMechazorProgress = this.getGameSession().getModifierClassForType(this.mechazorProgressType);
    const modifierMechazorsSummoned = this.getGameSession().getModifierClassForType(this.mechazorsBuiltType);

    const mechazorProgressMods = this.getCard().getActiveModifiersByClass(modifierMechazorProgress);
    const numMechazorsSummoned = this.getCard().getActiveModifiersByClass(modifierMechazorsSummoned).length;
    let mechazorProgress = 0;
    for (var mod of Array.from(mechazorProgressMods)) {
      mechazorProgress += mod.getProgressContribution();
    }
    return (mechazorProgress - (numMechazorsSummoned * 5)) * 20;
  }
}
ModifierCounterMechazorBuildProgress.initClass();


module.exports = ModifierCounterMechazorBuildProgress;
