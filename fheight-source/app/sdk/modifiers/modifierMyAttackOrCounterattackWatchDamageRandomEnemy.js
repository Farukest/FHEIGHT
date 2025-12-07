/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackOrCounterattackWatch = require('./modifierMyAttackOrCounterattackWatch');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');

class ModifierMyAttackOrCounterattackWatchDamageRandomEnemy extends ModifierMyAttackOrCounterattackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackOrCounterattackWatchDamageRandomEnemy";
    this.type ="ModifierMyAttackOrCounterattackWatchDamageRandomEnemy";
  
    this.prototype.damageAmount = 0;
  }

  static createContextObject(damageAmount, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onMyAttackOrCounterattackWatch(action) {

    const randomDamageAction = new RandomDamageAction(this.getGameSession());
    randomDamageAction.setOwnerId(this.getCard().getOwnerId());
    randomDamageAction.setSource(this.getCard());
    randomDamageAction.setDamageAmount(this.damageAmount);
    randomDamageAction.canTargetGenerals = true;
    return this.getGameSession().executeAction(randomDamageAction);
  }
}
ModifierMyAttackOrCounterattackWatchDamageRandomEnemy.initClass();

module.exports = ModifierMyAttackOrCounterattackWatchDamageRandomEnemy;
