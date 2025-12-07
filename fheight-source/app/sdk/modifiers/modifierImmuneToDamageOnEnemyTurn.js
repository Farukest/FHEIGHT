/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const DamageAction = require('app/sdk/actions/damageAction');

/*
  Modifier that reduces all damage dealt on enemy's turn to this unit to 0.
*/

class ModifierImmuneToDamageOnEnemyTurn extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageOnEnemyTurn";
    this.type ="ModifierImmModifierImmuneToDamageOnEnemyTurnuneToDamageByGeneral";
  
    this.modifierName ="Enemy Turn Immunity";
    this.description = "Takes no damage on enemy's turn";
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && (this.getGameSession().getCurrentTurn().getPlayerId() !== this.getCard().getOwnerId()) && a instanceof DamageAction && a.getIsValid() && (this.getCard() === a.getTarget());
  }
}
ModifierImmuneToDamageOnEnemyTurn.initClass();

module.exports = ModifierImmuneToDamageOnEnemyTurn;
