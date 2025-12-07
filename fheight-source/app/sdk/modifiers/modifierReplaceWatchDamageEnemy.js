/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierReplaceWatch = require('./modifierReplaceWatch');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierReplaceWatchDamageEnemy extends ModifierReplaceWatch {
  static initClass() {
  
    this.prototype.type ="ModifierReplaceWatchDamageEnemy";
    this.type ="ModifierReplaceWatchDamageEnemy";
  
    this.modifierName ="Replace Watch (damage random enemy)";
    this.description = "Whenever you replace a card, deal %X damage to a random enemy";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierReplaceWatch", "FX.Modifiers.ModifierGenericDamageSmall"];
  }

  static createContextObject(damageAmount, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onReplaceWatch(action) {
    const randomDamageAction = new RandomDamageAction(this.getGameSession());
    randomDamageAction.setOwnerId(this.getCard().getOwnerId());
    randomDamageAction.setSource(this.getCard());
    randomDamageAction.setDamageAmount(this.damageAmount);
    randomDamageAction.canTargetGenerals = true;
    return this.getGameSession().executeAction(randomDamageAction);
  }
}
ModifierReplaceWatchDamageEnemy.initClass();

module.exports = ModifierReplaceWatchDamageEnemy;
