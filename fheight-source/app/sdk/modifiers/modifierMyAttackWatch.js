/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const ForcedAttackAction = require('app/sdk/actions/forcedAttackAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierMyAttackWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatch";
    this.type ="ModifierMyAttackWatch";
  
    this.modifierName ="Attack Watch: Self";
    this.description ="Attack Watch: Self";
  
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
    if ((action.getSource() === this.getCard()) && ((action instanceof AttackAction && (!action.getIsImplicit() || action.getIsAutomatic())) || action instanceof ForcedAttackAction)) {
      return this.onMyAttackWatch(action);
    }
  }

  onMyAttackWatch(action) {}
}
ModifierMyAttackWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyAttackWatch;
