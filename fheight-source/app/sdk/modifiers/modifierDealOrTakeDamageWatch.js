/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDealOrTakeDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDealOrTakeDamageWatch";
    this.type ="ModifierDealOrTakeDamageWatch";
  
    this.modifierName ="Deal Or Take Damage Watch";
    this.description ="Each time this unit takes damage or damages an enemy unit...";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.enemyOnly = false; // whether this should trigger ONLY on damage dealt to enemies, or on ANY damage dealt
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch"];
  }

  onAction(actionEvent) {
    super.onAction(actionEvent);
    const a = actionEvent.action;
    if (this.getIsActionRelevant(a)) {
      return this.onDealOrTakeDamage(a);
    }
  }

  getIsActionRelevant(a) {
    // check if this action will deal damage or take damage
    return a instanceof DamageAction && ((a.getSource() === this.getCard()) || (a.getTarget() === this.getCard())) && this.willDealDamage(a);
  }

  willDealDamage(action) {
    // total damage should be calculated during modify_action_for_execution phase
    return action.getTotalDamageAmount() > 0;
  }

  onDealOrTakeDamage(action) {}
}
ModifierDealOrTakeDamageWatch.initClass();
    // override me in sub classes to implement special behavior
    // use this for most on damage triggers

module.exports = ModifierDealOrTakeDamageWatch;
