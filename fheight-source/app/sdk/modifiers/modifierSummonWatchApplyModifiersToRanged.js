/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSummonWatchApplyModifiers = require('./modifierSummonWatchApplyModifiers');
const ModifierRanged = require('./modifierRanged');

class ModifierSummonWatchApplyModifiersToRanged extends ModifierSummonWatchApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchApplyModifiersToRanged";
    this.type ="ModifierSummonWatchApplyModifiersToRanged";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }


  getIsCardRelevantToWatcher(card) {
    return card.hasActiveModifierClass(ModifierRanged);
  }
}
ModifierSummonWatchApplyModifiersToRanged.initClass();

module.exports = ModifierSummonWatchApplyModifiersToRanged;
