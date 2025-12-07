/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierIntensify = require('./modifierIntensify');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierIntensifyDamageEnemyGeneral extends ModifierIntensify {
  static initClass() {
  
    this.prototype.type ="ModifierIntensifyDamageEnemyGeneral";
    this.type ="ModifierIntensifyDamageEnemyGeneral";
  
    this.prototype.damageAmount = 0;
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onIntensify() {

    const totalDamageAmount = this.getIntensifyAmount() * this.damageAmount;

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());

    const enemyDamageAction = new DamageAction(this.getGameSession());
    enemyDamageAction.setOwnerId(this.getCard().getOwnerId());
    enemyDamageAction.setSource(this.getCard());
    enemyDamageAction.setTarget(enemyGeneral);
    enemyDamageAction.setDamageAmount(totalDamageAmount);
    return this.getGameSession().executeAction(enemyDamageAction);
  }
}
ModifierIntensifyDamageEnemyGeneral.initClass();

module.exports = ModifierIntensifyDamageEnemyGeneral;