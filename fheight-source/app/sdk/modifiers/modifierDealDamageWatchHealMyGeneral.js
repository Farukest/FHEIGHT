/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierDealDamageWatchHealMyGeneral extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchHealMyGeneral";
    this.type ="ModifierDealDamageWatchHealMyGeneral";
  
    this.modifierName ="Deal Damage Watch";
    this.description ="Whenever this minion deals damage, restore %X Health to your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, options) {
    if (healAmount == null) { healAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.healAmount);
    } else {
      return this.description;
    }
  }

  onDealDamage(action) {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(this.healAmount);
    return this.getGameSession().executeAction(healAction);
  }
}
ModifierDealDamageWatchHealMyGeneral.initClass();

module.exports = ModifierDealDamageWatchHealMyGeneral;
