/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierStartTurnWatchDamageRandom extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchDamageRandom";
    this.type ="ModifierStartTurnWatchDamageRandom";
  
    this.modifierName ="Turn Watch";
    this.description ="At the start of your turn, deal %X damage to a random minion or General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericChainLightning"];
  }

  static createContextObject(damageAmount, options) {
    if (damageAmount == null) { damageAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = this.description.replace(/%X/, modifierContextObject.damageAmount);

      return replaceText;
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const units = this.getGameSession().getBoard().getUnits();
      if (units.length > 0) {
        const unitToDamage = units[this.getGameSession().getRandomIntegerForExecution(units.length)];
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(unitToDamage);
        damageAction.setDamageAmount(this.damageAmount);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }
}
ModifierStartTurnWatchDamageRandom.initClass();

module.exports = ModifierStartTurnWatchDamageRandom;
