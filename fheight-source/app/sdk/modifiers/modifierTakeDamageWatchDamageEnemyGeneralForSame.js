/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDamageEnemyGeneralForSame extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDamageEnemyGeneralForSame";
    this.type ="ModifierTakeDamageWatchDamageEnemyGeneralForSame";
  
    this.description ="Whenever this minion takes damage, it deals that much damage to the enemy General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  onDamageTaken(action) {
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
ModifierTakeDamageWatchDamageEnemyGeneralForSame.initClass();

module.exports = ModifierTakeDamageWatchDamageEnemyGeneralForSame;
