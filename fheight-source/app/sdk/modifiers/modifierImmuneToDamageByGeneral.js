/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const AttackAction =   require('app/sdk/actions/attackAction');
const i18next = require('i18next');

/*
  Modifier that reduces all damage dealt by generals to this unit to 0.
*/

class ModifierImmuneToDamageByGeneral extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageByGeneral";
    this.type ="ModifierImmuneToDamageByGeneral";
  
    this.modifierName =i18next.t("modifiers.immune_to_damage_by_general_name");
    this.description =i18next.t("modifiers.immune_to_damage_by_general_def");
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof AttackAction && a.getIsValid() && (this.getCard() === a.getTarget()) && __guard__(a.getSource(), x => x.getIsGeneral());
  }
}
ModifierImmuneToDamageByGeneral.initClass();

module.exports = ModifierImmuneToDamageByGeneral;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}