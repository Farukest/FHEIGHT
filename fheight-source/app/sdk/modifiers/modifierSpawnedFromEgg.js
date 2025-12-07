/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const SetExhaustionAction =  require('app/sdk/actions/setExhaustionAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSpawnedFromEgg extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSpawnedFromEgg";
    this.type ="ModifierSpawnedFromEgg";
  
    this.prototype.maxStacks = 1;
  
    this.modifierName ="Spawned From Egg";
    this.description = "Spawned From An Egg";
  
    this.isHiddenToUI = true;
    this.prototype.isRemovable = false;
    this.prototype.isCloneable = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpawnedFromEgg"];
  }

  onApplyToCard(card)  {
    super.onApplyToCard(card);

    if (this._private.cachedIsActive) {
      // if General ended up in an Egg and is respawning, make sure it is not set as General
      card = this.getCard();
      if ((card.getType() === CardType.Unit) && card.getIsGeneral()) {
        card.setIsGeneral(false);
      }

      // set exhaustion state of hatched card to not exhausted
      // only do this when this modifier is initially applied to the card
      const setExhaustionAction = this.getGameSession().createActionForType(SetExhaustionAction.type);
      setExhaustionAction.setExhausted(false);
      setExhaustionAction.setMovesMade(0);
      setExhaustionAction.setAttacksMade(0);
      setExhaustionAction.setSource(this.getCard());
      setExhaustionAction.setTarget(this.getCard());
      return this.getCard().getGameSession().executeAction(setExhaustionAction);
    }
  }
}
ModifierSpawnedFromEgg.initClass();

module.exports = ModifierSpawnedFromEgg;
