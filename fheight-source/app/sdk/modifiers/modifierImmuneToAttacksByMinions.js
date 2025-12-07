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
  Modifier that invalidates attacks against this unit from minions.
*/

class ModifierImmuneToAttacksByMinions extends ModifierImmuneToAttacks {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToAttacksByMinions";
    this.type ="ModifierImmuneToAttacksByMinions";
  
    this.modifierName ="Minion Immunity";
    this.description = "Cannot be attacked by Minions";
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof AttackAction && a.getIsValid() && !a.getIsImplicit() && (this.getCard() === a.getTarget()) && !__guard__(a.getSource(), x => x.getIsGeneral());
  }
}
ModifierImmuneToAttacksByMinions.initClass();

module.exports = ModifierImmuneToAttacksByMinions;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}