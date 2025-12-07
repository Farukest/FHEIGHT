/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToAttacks =   require('./modifierImmuneToAttacks');
const AttackAction =   require('app/sdk/actions/attackAction');

/*
  Modifier that invalidates attacks against this unit from generals.
*/

class ModifierImmuneToAttacksByGeneral extends ModifierImmuneToAttacks {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToAttacksByGeneral";
    this.type ="ModifierImmuneToAttacksByGeneral";
  
    this.modifierName ="General Immunity";
    this.description = "Cannot be attacked by Generals";
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof AttackAction && a.getIsValid() && !a.getIsImplicit() && (this.getCard() === a.getTarget()) && __guard__(a.getSource(), x => x.getIsGeneral());
  }
}
ModifierImmuneToAttacksByGeneral.initClass();

module.exports = ModifierImmuneToAttacksByGeneral;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}