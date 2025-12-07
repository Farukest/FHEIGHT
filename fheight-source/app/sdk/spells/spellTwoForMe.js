/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Modifier = require('app/sdk/modifiers/modifier');

class SpellTwoForMe extends Spell {
  static initClass() {
  
    this.prototype.buffName = null;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const opponentPlayer = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());
      const opponentsDrawPile = opponentPlayer.getDeck().getDrawPile();

      if (opponentsDrawPile.length > 0) {
        const indexesOfMinions = [];
        for (let i = 0; i < opponentsDrawPile.length; i++) {
          var cardIndex = opponentsDrawPile[i];
          var card = this.getGameSession().getCardByIndex(cardIndex);
          if ((card != null) && (card.getType() === CardType.Unit)) {
            indexesOfMinions.push(i);
          }
        }

        if (indexesOfMinions.length > 0) {
          const randomIndex = indexesOfMinions[this.getGameSession().getRandomIntegerForExecution(indexesOfMinions.length)];
          const cardToSteal = this.getGameSession().getCardByIndex(opponentsDrawPile[randomIndex]);

          if (cardToSteal != null) {
            const newCardData = cardToSteal.createCloneCardData();
            newCardData.ownerId = this.getOwnerId(); // reset owner id to player who will recieve this card
            const statContextObject = Modifier.createContextObjectWithAttributeBuffs(1,1);
            statContextObject.appliedName = this.buffName;
            if (newCardData.additionalModifiersContextObjects == null) { newCardData.additionalModifiersContextObjects = []; }
            newCardData.additionalModifiersContextObjects.push(statContextObject);

            const removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), cardToSteal.getIndex(), opponentPlayer.getPlayerId());
            this.getGameSession().executeAction(removeCardFromDeckAction);
            const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), newCardData);
            return this.getGameSession().executeAction(putCardInHandAction);
          }
        }
      }
    }
  }
}
SpellTwoForMe.initClass();

module.exports = SpellTwoForMe;
