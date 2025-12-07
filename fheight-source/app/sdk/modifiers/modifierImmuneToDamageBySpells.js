/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const ModifierImmuneToDamage = require('./modifierImmuneToDamage');
const DamageAction =   require('app/sdk/actions/damageAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

class ModifierImmuneToDamageBySpells extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageBySpells";
    this.type ="ModifierImmuneToDamageBySpells";
  
    this.description =i18next.t("modifiers.immune_to_damage_by_spells_def");
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof DamageAction && a.getIsValid() && (this.getCard() === a.getTarget()) && a.getParentAction() instanceof ApplyCardToBoardAction && (__guard__(a.getParentAction().getCard(), x => x.type) === CardType.Spell);
  }
}
ModifierImmuneToDamageBySpells.initClass();

module.exports = ModifierImmuneToDamageBySpells;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}