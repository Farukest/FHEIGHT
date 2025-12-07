/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBackstab = require('./modifierBackstab');
const i18next = require('i18next');

// Backstab modifier that can only stack once (this HAS backstab X rather than GAINS backstab X)

class ModifierHasBackstab extends ModifierBackstab {
  static initClass() {
  
    this.prototype.type ="ModifierHasBackstab";
    this.type ="ModifierHasBackstab";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.backstab_def");
    this.description ="Has Backstab (%X)";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBackstab"];
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.backstabBonus);
    } else {
      return this.description;
    }
  }
}
ModifierHasBackstab.initClass();

module.exports = ModifierHasBackstab;
