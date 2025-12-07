/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatch";
    this.type ="ModifierTakeDamageWatch";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Whenever this minion takes damage...";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch"];
  }

  onAction(actionEvent) {
    super.onAction(actionEvent);

    const a = actionEvent.action;
    if (a instanceof DamageAction && (a.getTarget() === this.getCard())) {
      if (this.willDealDamage(a)) { // check if anything is preventing this action from dealing its damage
        return this.onDamageTaken(a);
      }
    }
  }

  willDealDamage(action) {
    // total damage should be calculated during modify_action_for_execution phase
    if (action.getTotalDamageAmount() > 0) {
      return true;
    }

    return false;
  }

  onDamageTaken(action) {}
}
ModifierTakeDamageWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierTakeDamageWatch;
