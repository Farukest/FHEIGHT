/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit =   require('./modifierOpeningGambit');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOpeningGambitMindwarp extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitMindwarp";
    this.type ="ModifierOpeningGambitMindwarp";
  
    this.description ="Gain a copy of a random spell from your opponent\'s action bar";
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // calculate card to steal only on the server, since only the server knows contents of both decks
      const opponentPlayer = this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId());
      const opponentDeck = opponentPlayer.getDeck();
      const indicesOfOpponentSpellsInHand = [];
      const drawPile = opponentDeck.getHand();
      // check opponent's hand for spells
      for (let i = 0; i < drawPile.length; i++) {
        var cardIndex = drawPile[i];
        var card = this.getGameSession().getCardByIndex(cardIndex);
        if ((card != null) && (card.getType() === CardType.Spell)) {
          indicesOfOpponentSpellsInHand.push(i);
        }
      }

      // if there's a spell there, randomly choose one of the spells
      if (indicesOfOpponentSpellsInHand.length > 0) {
        const indexOfCardInHand = indicesOfOpponentSpellsInHand[this.getGameSession().getRandomIntegerForExecution(indicesOfOpponentSpellsInHand.length)];
        const opponentCardIndex = drawPile[indexOfCardInHand];
        const opponentCard = this.getGameSession().getCardByIndex(opponentCardIndex);
        // add the spell to the current player's hand in place of the unit they just summoned
        const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), opponentCard.createNewCardData());
        return this.getGameSession().executeAction(putCardInHandAction);
      }
    }
  }
}
ModifierOpeningGambitMindwarp.initClass();

module.exports = ModifierOpeningGambitMindwarp;
