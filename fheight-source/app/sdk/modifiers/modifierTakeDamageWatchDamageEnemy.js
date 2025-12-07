/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDamageEnemy extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDamageEnemy";
    this.type ="ModifierTakeDamageWatchDamageEnemy";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onDamageTaken(action) {
    const randomDamageAction = new RandomDamageAction(this.getGameSession());
    randomDamageAction.setOwnerId(this.getCard().getOwnerId());
    randomDamageAction.setSource(this.getCard());
    randomDamageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(randomDamageAction);
  }
}
ModifierTakeDamageWatchDamageEnemy.initClass();

module.exports = ModifierTakeDamageWatchDamageEnemy;
