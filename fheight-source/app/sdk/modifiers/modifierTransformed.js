/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const SetExhaustionAction =  require('app/sdk/actions/setExhaustionAction');

class ModifierTransformed extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierTransformed";
    this.type ="ModifierTransformed";
  
    this.prototype.maxStacks = 1;
  
    this.modifierName ="Transformed";
    this.description = "Transformed";
  
    this.isHiddenToUI = true;
    this.prototype.isRemovable = false;
    this.prototype.isInherent = true; // transform should show description in card text
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.isCloneable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTransformed"];
  }

  static createContextObject(exhausted, movesMade, attacksMade, options) {
    const contextObject = super.createContextObject(options);
    contextObject.exhausted = exhausted;
    contextObject.movesMade = movesMade;
    contextObject.attacksMade = attacksMade;
    return contextObject;
  }

  onApplyToCard(card)  {
    super.onApplyToCard(card);

    // update exhaustion state of transformed card
    // only do this when this modifier is initially applied to the card
    if (this._private.cachedIsActive) {
      const setExhaustionAction = this.getGameSession().createActionForType(SetExhaustionAction.type);
      setExhaustionAction.setExhausted(this.exhausted);
      setExhaustionAction.setMovesMade(this.movesMade);
      setExhaustionAction.setAttacksMade(this.attacksMade);
      setExhaustionAction.setSource(this.getCard());
      setExhaustionAction.setTarget(this.getCard());
      return this.getCard().getGameSession().executeAction(setExhaustionAction);
    }
  }
}
ModifierTransformed.initClass();

module.exports = ModifierTransformed;
