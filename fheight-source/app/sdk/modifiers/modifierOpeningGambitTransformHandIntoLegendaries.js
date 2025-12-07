/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const RemoveCardFromHandAction = require('app/sdk/actions/removeCardFromHandAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup');
const Rarity = require('app/sdk/cards/rarityLookup');
const GameFormat = require('app/sdk/gameFormat');
const ModifierCannotBeRemovedFromHand = require('./modifierCannotBeRemovedFromHand');

class ModifierOpeningGambitTransformHandIntoLegendaries extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitTransformHandIntoLegendaries";
    this.type = "ModifierOpeningGambitTransformHandIntoLegendaries";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const factionId = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()).getFactionId();
      let factionCards = [];
      let neutralCards = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        factionCards = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(factionId).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(true).getIsSkinned(false).getCards();
        neutralCards = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Neutral).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(true).getIsSkinned(false).getCards();
      } else {
        factionCards = this.getGameSession().getCardCaches().getFaction(factionId).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(true).getIsSkinned(false).getCards();
        neutralCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(true).getIsSkinned(false).getCards();
      }
      const possibleCards = [].concat(factionCards, neutralCards);

      if (possibleCards.length > 0) {
        return (() => {
          const result = [];
          const iterable = this.getOwner().getDeck().getCardsInHand();
          for (let i = 0; i < iterable.length; i++) {
            var card = iterable[i];
            if ((card != null) && !card.hasActiveModifierClass(ModifierCannotBeRemovedFromHand)) {
              var removeCardFromHandAction = new RemoveCardFromHandAction(this.getGameSession(), i, this.getOwnerId());
              this.getGameSession().executeAction(removeCardFromHandAction);

              var cardToAdd = possibleCards[this.getGameSession().getRandomIntegerForExecution(possibleCards.length)];

              var putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), cardToAdd.createNewCardData());
              result.push(this.getGameSession().executeAction(putCardInHandAction));
            } else {
              result.push(undefined);
            }
          }
          return result;
        })();
      }
    }
  }
}
ModifierOpeningGambitTransformHandIntoLegendaries.initClass();

module.exports = ModifierOpeningGambitTransformHandIntoLegendaries;