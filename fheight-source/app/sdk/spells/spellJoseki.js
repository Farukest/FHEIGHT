/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellJoseki extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    let putCardInHandAction, removeCardFromDeckAction;
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const opponentPlayer = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());

    const opponentsDrawPile = opponentPlayer.getDeck().getDrawPile();
    const myDrawPile = this.getGameSession().getPlayerById(this.getOwnerId()).getDeck().getDrawPile();
    const opponentCard = this.getGameSession().getCardByIndex(opponentsDrawPile[this.getGameSession().getRandomIntegerForExecution(opponentsDrawPile.length)]);
    const myCard = this.getGameSession().getCardByIndex(myDrawPile[this.getGameSession().getRandomIntegerForExecution(myDrawPile.length)]);

    if (opponentCard != null) {
      const myNewCardData = opponentCard.createCardData();
      myNewCardData.ownerId = this.getOwnerId(); // reset owner id to player who will recieve this card
      removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), opponentCard.getIndex(), opponentPlayer.getPlayerId());
      this.getGameSession().executeAction(removeCardFromDeckAction);
      putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), myNewCardData);
      this.getGameSession().executeAction(putCardInHandAction);
    }

    if (myCard != null) {
      const opponentNewCardData = myCard.createCardData();
      opponentNewCardData.ownerId = opponentPlayer.getPlayerId(); // reset owner id to player who will recieve this card
      removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), myCard.getIndex(), this.getOwnerId());
      this.getGameSession().executeAction(removeCardFromDeckAction);
      putCardInHandAction = new PutCardInHandAction(this.getGameSession(),opponentPlayer.getPlayerId(), opponentNewCardData);
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}

module.exports = SpellJoseki;
