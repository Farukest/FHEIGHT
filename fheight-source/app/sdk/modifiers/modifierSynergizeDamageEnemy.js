/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSynergizeDamageEnemy extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeDamageEnemy";
    this.type ="ModifierSynergizeDamageEnemy";
  
    this.description = "Deal %X damage to a random enemy";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize", "FX.Modifiers.ModifierGenericDamage"];
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

  onSynergize(action) {
    const randomDamageAction = new RandomDamageAction(this.getGameSession());
    randomDamageAction.setOwnerId(this.getCard().getOwnerId());
    randomDamageAction.setSource(this.getCard());
    randomDamageAction.setDamageAmount(this.damageAmount);
    randomDamageAction.canTargetGenerals = true;
    return this.getGameSession().executeAction(randomDamageAction);
  }
}
ModifierSynergizeDamageEnemy.initClass();

module.exports = ModifierSynergizeDamageEnemy;
