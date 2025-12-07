/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const ForcedAttackAction = require('app/sdk/actions/forcedAttackAction');
const ModifierStrikeback = require('app/sdk/modifiers/modifierStrikeback');

class ModifierMyAttackOrCounterattackWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackOrCounterattackWatch";
    this.type ="ModifierMyAttackOrCounterattackWatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyAttackWatch"];
  }

  onAction(event) {
    super.onAction(event);
    const {
      action
    } = event;
    if ((action.getSource() === this.getCard()) && ( (action instanceof AttackAction && (!action.getIsImplicit() || action.getTriggeringModifier() instanceof ModifierStrikeback)) || action instanceof ForcedAttackAction)) {
      return this.onMyAttackOrCounterattackWatch(action);
    }
  }

  onMyAttackOrCounterattackWatch(action) {}
}
ModifierMyAttackOrCounterattackWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyAttackOrCounterattackWatch;
