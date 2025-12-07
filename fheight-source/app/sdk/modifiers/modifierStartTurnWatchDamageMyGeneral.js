/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const DamageAction = require('app/sdk/actions/damageAction');

const CONFIG = require('app/common/config');

class ModifierStartTurnWatchDamageMyGeneral extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchDamageMyGeneral";
    this.type ="ModifierStartTurnWatchDamageMyGeneral";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericChainLightningRed"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(general);
      if (!this.damageAmount) {
        damageAction.setDamageAmount(this.getCard().getATK());
      } else {
        damageAction.setDamageAmount(this.damageAmount);
      }
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierStartTurnWatchDamageMyGeneral.initClass();

module.exports = ModifierStartTurnWatchDamageMyGeneral;
