/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const CardType = require('app/sdk/cards/cardType');
const ModifierImmuneToDamage = require('./modifierImmuneToDamage');
const DamageAction = require('app/sdk/actions/damageAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const i18next = require('i18next');

class ModifierImmuneToSpellDamage extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type = "ModifierImmuneToSpellDamage";
    this.type = "ModifierImmuneToSpellDamage";
  
    this.modifierName =i18next.t("modifiers.immune_to_spell_damage_name");
    this.description =i18next.t("modifiers.immune_to_spell_damage_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierImmunity", "FX.Modifiers.ModifierImmunitySpell"];
  }

  getIsActionRelevant(a) {
    if ((this.getCard() != null) && a instanceof DamageAction && (this.getCard() === a.getTarget()) && !a.getCreatedByTriggeringModifier() && (__guard__(a.getSource(), x => x.getType()) === CardType.Spell)) {
      const rootAction = a.getRootAction();
      // this action was not triggered by a modifier, but was it caused by a spell cast?
      if (rootAction instanceof ApplyCardToBoardAction && (__guard__(rootAction.getCard().getRootCard(), x1 => x1.getType()) === CardType.Spell)) {
        return true;
      }
    }
    return false;
  }
}
ModifierImmuneToSpellDamage.initClass();

module.exports = ModifierImmuneToSpellDamage;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}