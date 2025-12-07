/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDealDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatch";
    this.type ="ModifierDealDamageWatch";
  
    this.modifierName ="Deal Damage Watch";
    this.description ="Each time this unit damages an enemy unit...";
  
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
      return this.onDealDamage(a);
    }
  }

  onAfterCleanupAction(actionEvent) {
    super.onAfterCleanupAction(actionEvent);
    const a = actionEvent.action;
    if (this.getIsActionRelevant(a)) {
      return this.onAfterDealDamage(a);
    }
  }

  getIsActionRelevant(a) {
    // check if this action will deal damage
    let isRelevant = a instanceof DamageAction && (a.getSource() === this.getCard()) && this.willDealDamage(a);
    if (this.enemyOnly) { // check that target of damage action is an enemy
      isRelevant = isRelevant && (a.getTarget().getOwnerId() !== this.getCard().getOwnerId());
    }
    return isRelevant;
  }

  willDealDamage(action) {
    // total damage should be calculated during modify_action_for_execution phase
    return action.getTotalDamageAmount() > 0;
  }

  onDealDamage(action) {}
    // override me in sub classes to implement special behavior
    // use this for most on damage triggers

  onAfterDealDamage(action) {}
}
ModifierDealDamageWatch.initClass();
    // override me in sub classes to implement special behavior
    // use this for on deal damage triggers that MUST happen last
    // - careful! if the unit dies during this step, this method will not be called!

module.exports = ModifierDealDamageWatch;
