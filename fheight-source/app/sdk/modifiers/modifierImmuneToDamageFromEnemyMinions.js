/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const DamageAction =   require('app/sdk/actions/damageAction');

/*
  Modifier that reduces all damage dealt by generals to this unit to 0.
*/

class ModifierImmuneToDamageFromEnemyMinions extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageFromEnemyMinions";
    this.type ="ModifierImmuneToDamageFromEnemyMinions";
  
    this.modifierName ="Enemy Minion Immunity";
    this.description = "Takes no damage from enemy minions";
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof DamageAction && a.getIsValid() && (this.getCard() === a.getTarget()) && !(__guard__(a.getSource(), x => x.getIsGeneral())) && (__guard__(a.getSource(), x1 => x1.getOwnerId()) !== this.getCard().getOwnerId());
  }
}
ModifierImmuneToDamageFromEnemyMinions.initClass();

module.exports = ModifierImmuneToDamageFromEnemyMinions;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}