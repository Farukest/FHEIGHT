/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyMinionAttackWatch = require('./modifierMyMinionAttackWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierMyMinionAttackWatchHealGeneral extends ModifierMyMinionAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyMinionAttackWatchHealGeneral";
    this.type ="ModifierMyMinionAttackWatchHealGeneral";
  
    this.modifierName ="MyMinionAttackWatch Heal My General";
    this.description ="Whenever a friendly minion attacks, restore %X Health to your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyMinionAttackWatch", "FX.Modifiers.ModifierGenericHeal"];
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

  onMyMinionAttackWatch(action) {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(this.healAmount);
    return this.getGameSession().executeAction(healAction);
  }
}
ModifierMyMinionAttackWatchHealGeneral.initClass();

module.exports = ModifierMyMinionAttackWatchHealGeneral;
