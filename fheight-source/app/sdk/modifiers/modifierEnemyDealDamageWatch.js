/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEnemyDealDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyDealDamageWatch";
    this.type ="ModifierEnemyDealDamageWatch";
  
    this.modifierName ="Enemy Deal Damage Watch";
    this.description ="Whenever an enemy deals damage...";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onAction(actionEvent) {
    super.onAction(actionEvent);

    const a = actionEvent.action;
    if (a instanceof DamageAction && (__guard__(a.getTarget(), x => x.getOwnerId()) === this.getCard().getOwnerId())) {
      if (this.willDealDamage(a)) { // check if anything is preventing this action from dealing its damage
        return this.onEnemyDamageDealt(a);
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

  onEnemyDamageDealt(action) {}
}
ModifierEnemyDealDamageWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierEnemyDealDamageWatch;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}