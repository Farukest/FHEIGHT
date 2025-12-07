/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierHPChange extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierHPChange";
    this.type ="ModifierHPChange";
  
    this.modifierName ="Modifier HP Change";
    this.description = "Whenever this card's HP changes";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBuffSelfOnReplace"];
  }
  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    if ((action.getTarget() === this.getCard()) && ((action instanceof HealAction && (action.getTotalHealApplied() > 0)) || (action instanceof DamageAction && (action.getTotalDamageAmount() > 0)))) {
      return this.onHPChange(action);
    }
  }

  onHPChange(e) {}
}
ModifierHPChange.initClass();
    // override in sub-class
module.exports = ModifierHPChange;
