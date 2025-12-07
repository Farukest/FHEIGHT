/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const HealAction =  require('app/sdk/actions/healAction');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');

class ModifierSummonWatchHealSelf extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchHealSelf";
    this.type ="ModifierSummonWatchHealSelf";
  
    this.prototype.name ="Summon Watch Heal Self";
    this.prototype.description = "Whenever you summon a minion, heal this unit";
  
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, options) {
    if (healAmount == null) { healAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onSummonWatch(action) {
    const healAction = new HealAction(this.getCard().getGameSession());
    healAction.setHealAmount(this.healAmount);
    healAction.setSource(this.getCard());
    healAction.setTarget(this.getCard());
    return this.getCard().getGameSession().executeAction(healAction);
  }

  getIsCardRelevantToWatcher(card) {
    return card.getDamage() > 0;
  }
}
ModifierSummonWatchHealSelf.initClass(); //only heal if unit is currently damaged

module.exports = ModifierSummonWatchHealSelf;
