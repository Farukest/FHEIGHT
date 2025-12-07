/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBackstabWatch = require('./modifierBackstabWatch');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const CardType = require('app/sdk/cards/cardType');

const i18next = require('i18next');

class ModifierBackstabWatchStealSpellFromDeck extends ModifierBackstabWatch {
  static initClass() {
  
    this.prototype.type ="ModifierBackstabWatchStealSpellFromDeck";
    this.type ="ModifierBackstabWatchStealSpellFromDeck";
  
    this.modifierName =i18next.t("modifiers.backstab_watch_steal_spell_from_deck_name");
    this.description =i18next.t("modifiers.backstab_watch_steal_spell_from_deck_def");
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onBackstabWatch(action) {

    const opponentPlayer = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());
    const opponentsDrawPile = opponentPlayer.getDeck().getDrawPile();

    const indicesOfOpponentSpellsInDeck = [];
    // check opponent's deck for spells
    for (let i = 0; i < opponentsDrawPile.length; i++) {
      var cardIndex = opponentsDrawPile[i];
      var card = this.getGameSession().getCardByIndex(cardIndex);
      if ((card != null) && (card.getType() === CardType.Spell)) {
        indicesOfOpponentSpellsInDeck.push(i);
      }
    }

    // get random spell from opponent's deck
    if (indicesOfOpponentSpellsInDeck.length > 0) {
      const indexOfCardInDeck = indicesOfOpponentSpellsInDeck[this.getGameSession().getRandomIntegerForExecution(indicesOfOpponentSpellsInDeck.length)];
      const opponentCardIndex = opponentsDrawPile[indexOfCardInDeck];
      const opponentCard = this.getGameSession().getCardByIndex(opponentCardIndex);

      if (opponentCard != null) {
        const myNewCardData = opponentCard.createCardData();
        myNewCardData.ownerId = this.getOwnerId(); // reset owner id to player who will receive this card
        const removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), opponentCard.getIndex(), opponentPlayer.getPlayerId());
        this.getGameSession().executeAction(removeCardFromDeckAction);
        const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), myNewCardData);
        return this.getGameSession().executeAction(putCardInHandAction);
      }
    }
  }
}
ModifierBackstabWatchStealSpellFromDeck.initClass();

module.exports = ModifierBackstabWatchStealSpellFromDeck;
