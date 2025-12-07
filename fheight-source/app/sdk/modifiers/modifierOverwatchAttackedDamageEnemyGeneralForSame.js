/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierOverwatchAttacked = require('./modifierOverwatchAttacked');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOverwatchAttackedDamageEnemyGeneralForSame extends ModifierOverwatchAttacked {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchAttackedDamageEnemyGeneralForSame";
    this.type ="ModifierOverwatchAttackedDamageEnemyGeneralForSame";
  
    this.description = "When this minion is attacked, deal the same damage to enemy general.";
  }

  onOverwatch(action) {
    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());

    if (enemyGeneral != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(enemyGeneral);
      damageAction.setDamageAmount(action.getTotalDamageAmount());
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierOverwatchAttackedDamageEnemyGeneralForSame.initClass();

module.exports = ModifierOverwatchAttackedDamageEnemyGeneralForSame;
