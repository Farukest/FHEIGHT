/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierOpeningGambitRemoveCardsFromDecksByCost extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitRemoveCardsFromDecksByCost";
    this.type = "ModifierOpeningGambitRemoveCardsFromDecksByCost";
  
    this.prototype.manaCost = null;
    this.prototype.affectMyDeck = true;
    this.prototype.affectOppDeck = true;
  }

  static createContextObject(manaCost, affectMyDeck, affectOppDeck, options) {
    if (affectMyDeck == null) { affectMyDeck = true; }
    if (affectOppDeck == null) { affectOppDeck = true; }
    const contextObject = super.createContextObject();
    contextObject.manaCost = manaCost;
    contextObject.affectMyDeck = affectMyDeck;
    contextObject.affectOppDeck = affectOppDeck;

    return contextObject;
  }

  onOpeningGambit() {

    if (this.manaCost != null) {
      let cardAtIndex, cardIndex, i, removeCardFromDeckAction;
      if (this.affectMyDeck) {
        const myDrawPile = this.getOwner().getDeck().getDrawPile();
        for (i = 0; i < myDrawPile.length; i++) {
          cardIndex = myDrawPile[i];
          cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
          if (((cardAtIndex != null ? cardAtIndex.getManaCost() : undefined) <= this.manaCost) && (cardAtIndex.getType() === CardType.Unit)) {
            removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), cardAtIndex.getIndex(), this.getOwner().getPlayerId());
            this.getGameSession().executeAction(removeCardFromDeckAction);
          }
        }
      }

      if (this.affectOppDeck) {
        const opponent = this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId());
        const opponentDrawPile = opponent.getDeck().getDrawPile();
        return (() => {
          const result = [];
          for (i = 0; i < opponentDrawPile.length; i++) {
            cardIndex = opponentDrawPile[i];
            cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
            if (((cardAtIndex != null ? cardAtIndex.getManaCost() : undefined) <= this.manaCost) && (cardAtIndex.getType() === CardType.Unit)) {
              removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), cardAtIndex.getIndex(), opponent.getPlayerId());
              result.push(this.getGameSession().executeAction(removeCardFromDeckAction));
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
ModifierOpeningGambitRemoveCardsFromDecksByCost.initClass();

module.exports = ModifierOpeningGambitRemoveCardsFromDecksByCost;
