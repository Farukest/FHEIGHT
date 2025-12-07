/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const HealAction = require('app/sdk/actions/healAction');

class ModifierOpeningGambitHealBothGenerals extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitHealBothGenerals";
    this.type = "ModifierOpeningGambitHealBothGenerals";
  
    this.modifierName = "Opening Gambit";
    this.description = "Restore %X Health to BOTH Generals";
  
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, options) {
    const contextObject = super.createContextObject();
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

  onOpeningGambit() {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(this.healAmount);
    this.getGameSession().executeAction(healAction);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));

    const healAction2 = new HealAction(this.getGameSession());
    healAction2.setOwnerId(this.getCard().getOwnerId());
    healAction2.setTarget(enemyGeneral);
    healAction2.setHealAmount(this.healAmount);
    return this.getGameSession().executeAction(healAction2);
  }
}
ModifierOpeningGambitHealBothGenerals.initClass();

module.exports = ModifierOpeningGambitHealBothGenerals;
