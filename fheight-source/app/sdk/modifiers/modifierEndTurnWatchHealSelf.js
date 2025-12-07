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

class ModifierEndTurnWatchHealSelf extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierEndTurnWatchHealSelf";
    this.type = "ModifierEndTurnWatchHealSelf";
  
    this.modifierName = "End Turn Heal";
    this.description = "Restore %X Health to this minion at the end of your turn";
  
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
    return this.getGameSession().executeAction(healAction1);
  }
}
ModifierEndTurnWatchHealSelf.initClass();

module.exports = ModifierEndTurnWatchHealSelf;
