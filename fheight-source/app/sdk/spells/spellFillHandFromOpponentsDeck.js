/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');
const _ = require('underscore');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellFillHandFromOpponentsDeck extends Spell {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    //get number of empty slots in hand I need to Fill
    let emptySlots = 0;
    const myHand = this.getGameSession().getPlayerById(this.getOwnerId()).getDeck().getHand();
    for (var card of Array.from(myHand)) {
      if ((card === null) || (card === undefined)) {
        emptySlots++;
      }
    }

    if (emptySlots > 0) {
      let opponentCard, opponentPlayer;
      const cardIndices = []; //first create indices of the cards we want to take from the opponent's deck
      for (let i = 1, end = emptySlots, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        opponentPlayer = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());
        var opponentsDrawPile = opponentPlayer.getDeck().getDrawPile();
        if (opponentsDrawPile.length > 0) {
          var randomIndex = this.getGameSession().getRandomIntegerForExecution(opponentsDrawPile.length);
          opponentCard = this.getGameSession().getCardByIndex(opponentsDrawPile[randomIndex]);
          cardIndices.push(opponentCard);
          opponentsDrawPile.splice(randomIndex, 1);
        }
      }

      //then we can cycle through those indices without worrying about the same instance of a card being chosen multiple times
      if (cardIndices.length > 0) {
        return (() => {
          const result = [];
          for (var newCard of Array.from(cardIndices)) {
            if (opponentCard != null) {
              var myNewCardData = newCard.createCardData();
              myNewCardData.ownerId = this.getOwnerId(); // reset owner id to player who will recieve this card
              var removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), newCard.getIndex(), opponentPlayer.getPlayerId());
              this.getGameSession().executeAction(removeCardFromDeckAction);
              var putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), myNewCardData);
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
SpellFillHandFromOpponentsDeck.initClass();

module.exports = SpellFillHandFromOpponentsDeck;
