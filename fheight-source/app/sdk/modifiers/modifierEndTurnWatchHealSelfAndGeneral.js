/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const HealAction = require("app/sdk/actions/healAction");

class ModifierEndTurnWatchHealSelfAndGeneral extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierEndTurnWatchHealSelfAndGeneral";
    this.type = "ModifierEndTurnWatchHealSelfAndGeneral";
  
    this.modifierName = "End Turn Heal";
    this.description = "Restore %X Health to this minion and your General at the end of your turn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericHeal"];
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

  onTurnWatch() {
    super.onTurnWatch();

    const healAction1 = this.getGameSession().createActionForType(HealAction.type);
    healAction1.setTarget(this.getCard());
    healAction1.setHealAmount(this.healAmount);
    this.getGameSession().executeAction(healAction1);

    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (myGeneral != null) {
      const healAction2 = new HealAction(this.getGameSession());
      healAction2.setOwnerId(this.getCard().getOwnerId());
      healAction2.setTarget(myGeneral);
      healAction2.setHealAmount(this.healAmount);
      return this.getGameSession().executeAction(healAction2);
    }
  }
}
ModifierEndTurnWatchHealSelfAndGeneral.initClass();

module.exports = ModifierEndTurnWatchHealSelfAndGeneral;
