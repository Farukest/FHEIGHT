/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierUntargetable extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierUntargetable";
    this.type = "ModifierUntargetable";
  
    this.modifierName =i18next.t("modifiers.untargetable_name");
    this.description =i18next.t("modifiers.untargetable_def");
  
    this.prototype.maxStacks = 1;
  }
}
ModifierUntargetable.initClass();

module.exports = ModifierUntargetable;
