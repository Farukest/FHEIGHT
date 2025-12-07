/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierHealWatch = require('./modifierHealWatch');
const CardType = require('app/sdk/cards/cardType');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');

class ModifierHealWatchDamageRandomEnemy extends ModifierHealWatch {
  static initClass() {
  
    this.prototype.type ="ModifierHealWatchDamageRandomEnemy";
    this.type ="ModifierHealWatchDamageRandomEnemy";
  
    this.modifierName ="Heal Watch Damage Random Enemy for X";
    this.description = "Whenever anything is healed, a random enemy takes damage";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierHealWatch", "FX.Modifiers.ModifierGenericDamageSmall"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onHealWatch(action) {
    let damageAmount;
    if (!this.damageAmount) {
      damageAmount = action.getTotalHealApplied();
    } else {
      ({
        damageAmount
      } = this);
    }

    if (damageAmount > 0) {
      const randomDamageAction = new RandomDamageAction(this.getGameSession());
      randomDamageAction.setOwnerId(this.getCard().getOwnerId());
      randomDamageAction.setSource(this.getCard());
      randomDamageAction.setDamageAmount(damageAmount);
      randomDamageAction.canTargetGenerals = true;
      return this.getGameSession().executeAction(randomDamageAction);
    }
  }
}
ModifierHealWatchDamageRandomEnemy.initClass();

module.exports = ModifierHealWatchDamageRandomEnemy;
