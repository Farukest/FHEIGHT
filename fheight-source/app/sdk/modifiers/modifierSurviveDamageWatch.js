/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierSurviveDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSurviveDamageWatch";
    this.type ="ModifierSurviveDamageWatch";
  
  
    this.modifierName ="Survive Damage Watch";
    this.description = "Survive Damage";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSurviveDamageWatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    // watch for this card taking damage > 0 AND surviving the damage
    if (action instanceof DamageAction && (action.getTarget() === this.getCard()) && (action.getTotalDamageAmount() > 0)) {
      return this.onSurviveDamage(action);
    }
  }

  onSurviveDamage(action) {}
}
ModifierSurviveDamageWatch.initClass();
    // override me in sub classes to implement special behavior


module.exports = ModifierSurviveDamageWatch;
