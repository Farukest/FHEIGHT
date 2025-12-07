/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmune = require('./modifierImmune');
const AttackAction =   require('app/sdk/actions/attackAction');
const i18next = require('i18next');

/*
  Modifier that invalidates explicit attacks against this unit.
*/

class ModifierImmuneToAttacks extends ModifierImmune {
  static initClass() {
  
    this.prototype.type = "ModifierImmuneToAttacks";
    this.type = "ModifierImmuneToAttacks";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierImmunity", "FX.Modifiers.ModifierImmunityAttack"];
  }

  onValidateAction(event) {
    const a = event.action;

    if (this.getIsActionRelevant(a)) {
      return this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.immune_to_attacks_error"));
    }
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof AttackAction && a.getIsValid() && !a.getIsImplicit() && (this.getCard() === a.getTarget());
  }
}
ModifierImmuneToAttacks.initClass();

module.exports = ModifierImmuneToAttacks;
