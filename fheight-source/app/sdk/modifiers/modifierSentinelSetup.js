/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierManaCostChange = require('./modifierManaCostChange');
const ModifierSentinel = require('./modifierSentinel');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierSentinelSetup extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelSetup";
    this.type ="ModifierSentinelSetup";
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = false;
    this.prototype.isRemovable = false;
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(sentinelCardData,options) {
    const contextObject = super.createContextObject(options);
    contextObject.sentinelCardData = sentinelCardData;
    return contextObject;
  }

  onModifyActionForExecution(event) {
    const {
      action
    } = event;
    if ((action != null) && action instanceof PlayCardFromHandAction && action.getIsValid() && (action.getCard() === this.getCard())) {
      for (var mod of Array.from(this.getCard().getModifiers())) {
        // find all non-inherent modifiers added to this unit in hand (can ignore mana modifiers as they are deleted upon the unit being played)
        if (!(mod.getIsInherent() || mod.getIsAdditionalInherent()) && (mod.getType() !== ModifierManaCostChange.type)) {
          for (var additionalModContextObject of Array.from(this.sentinelCardData.additionalModifiersContextObjects)) {
            var additionalMod = this.getGameSession().getOrCreateModifierFromContextObjectOrIndex(additionalModContextObject);
            // find the sentinel modifier context object, and add the hand buffs so that they will transfer to the TRANSFORMED unit after sentinel triggers
            if (additionalMod instanceof ModifierSentinel) {
              if (additionalModContextObject.transformCardData.additionalModifiersContextObjects == null) { additionalModContextObject.transformCardData.additionalModifiersContextObjects = []; }
              additionalModContextObject.transformCardData.additionalModifiersContextObjects.push(mod.createContextObjectForClone());
            }
          }
        }
      }
      if (Cards.getIsPrismaticCardId(this.getCard().getId())) {
        this.sentinelCardData.id = Cards.getPrismaticCardId(this.sentinelCardData.id);
      }
      const newCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.sentinelCardData);
      newCard.ownerId = this.getCard().getOwnerId();
      // re-index card here as card has changed from original card played from hand
      // cards are normally indexed as soon as action is verified valid by game session, but we are swapping card being played from hand
      // so we must re-index the hidden sentinel card that is actually being played to board
      this.getGameSession()._indexCardAsNeeded(newCard);
      // set the new card to be played in the play card action
      action.overrideCard(newCard);
      return action.setCardDataOrIndex(this.sentinelCardData);
    }
  }
}
ModifierSentinelSetup.initClass();

module.exports = ModifierSentinelSetup;
