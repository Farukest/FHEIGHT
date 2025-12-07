/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierTakeDamageWatchHealMyGeneral extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchHealMyGeneral";
    this.type ="ModifierTakeDamageWatchHealMyGeneral";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Whenever this minion takes damage, restore %X Health to your General";
  
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, options) {
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

  onDamageTaken(action) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    if (general != null) {
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.getCard().getOwnerId());
      healAction.setSource(this.getCard());
      healAction.setTarget(general);
      healAction.setHealAmount(this.healAmount);
      return this.getGameSession().executeAction(healAction);
    }
  }
}
ModifierTakeDamageWatchHealMyGeneral.initClass();

module.exports = ModifierTakeDamageWatchHealMyGeneral;
