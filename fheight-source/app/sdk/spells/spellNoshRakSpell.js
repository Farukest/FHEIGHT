/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellNoshRakSpell extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const deck = this.getGameSession().getPlayerById(this.getOwnerId()).getDeck();

    const numCardsNeeded = deck.getHand().length - deck.getHandExcludingMissing().length;
    if (numCardsNeeded > 0) { // how many cards needed to fill hand?
      return (() => {
        const result = [];
        for (let i = 0, end = numCardsNeeded, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        // create a random vetruvian card
          var vetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction3).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();
          var cardToDraw = vetCards[this.getGameSession().getRandomIntegerForExecution(vetCards.length)];
          var cardDataOrIndexToDraw = cardToDraw.createNewCardData();
          // reduce its cost to 0
          var manaCostChangeContextObject = ModifierManaCostChange.createContextObject(0);
          manaCostChangeContextObject.attributeBuffsAbsolute = ["manaCost"];
          manaCostChangeContextObject.attributeBuffsFixed = ["manaCost"];
          cardDataOrIndexToDraw.additionalModifiersContextObjects = [manaCostChangeContextObject];
          // put it in hand
          var a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), cardDataOrIndexToDraw);
          result.push(this.getGameSession().executeAction(a));
        }
        return result;
      })();
    }
  }
}

module.exports = SpellNoshRakSpell;
