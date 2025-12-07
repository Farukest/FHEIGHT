/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCannot = require('./modifierCannot');
const i18next = require('i18next');

class ModifierCannotMove extends ModifierCannot {
  static initClass() {
  
    this.prototype.type ="ModifierCantMove";
    this.type ="ModifierCantMove";
  
    this.modifierName = i18next.t("modifiers.faction_3_spell_sand_trap_1");
    this.description = i18next.t("modifiers.faction_3_spell_sand_trap_1");
  
    this.prototype.attributeBuffs =
      {speed: 0};
    this.prototype.attributeBuffsAbsolute = ["speed"];
    this.prototype.attributeBuffsFixed = ["speed"];
  }
}
ModifierCannotMove.initClass();


module.exports = ModifierCannotMove;
