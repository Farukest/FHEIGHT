/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSentinelOpponentSummon = require('./modifierSentinelOpponentSummon');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierSentinelOpponentSummonDamageIt extends ModifierSentinelOpponentSummon {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSummonDamageIt";
    this.type ="ModifierSentinelOpponentSummonDamageIt";
  }

  static createContextObject(description, transformCardId, damageAmount, options) {
    if (damageAmount == null) { damageAmount = 0; }
    const contextObject = super.createContextObject(description, transformCardId, options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onOverwatch(action) {
    super.onOverwatch(action); // transform unit
    // damage unit that was just summoned by enemy
    if (action.getTarget() != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(action.getTarget());
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierSentinelOpponentSummonDamageIt.initClass();

module.exports = ModifierSentinelOpponentSummonDamageIt;
