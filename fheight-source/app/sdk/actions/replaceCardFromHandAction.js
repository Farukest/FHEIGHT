/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const Analytics = require('app/common/analytics');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Action =     require('./action');
const PutCardInHandAction = require('./putCardInHandAction');
const _ = require("underscore");

class ReplaceCardFromHandAction extends PutCardInHandAction {
  static initClass() {
  
    this.type ="ReplaceCardFromHandAction";
    this.prototype.replacedCardIndex = null; // index of card replaced
    this.prototype.forcedReplace = false;
     // if this is a forced replace, we won't count it against the player's normal replaces allowed per turn
  }

  constructor(gameSession, ownerId, indexOfCardInHand) {
    super(gameSession, ownerId, null, indexOfCardInHand);
    this.type = ReplaceCardFromHandAction.type;
  }

  _execute() {
    const player = this.getGameSession().getPlayerById(this.getOwnerId());
    const deck = player.getDeck();
    const drawPile = deck.getDrawPile();

    if (!this.getIsForcedReplace()) {
      // increase replaced card count
      deck.setNumCardsReplacedThisTurn(deck.getNumCardsReplacedThisTurn() + 1);
    }

    if (this.getGameSession().getIsRunningAsAuthoritative() && (drawPile.length > 0)) {
      // get replaced card before doing anything
      this.replacedCardIndex = deck.getCardIndexInHandAtIndex(this.indexOfCardInHand);

      // make a copy of indices
      const indices = _.range(drawPile.length);

      // find first card from the top down that is different
      let indexOfCardInDeck = null;
      if (this.replacedCardIndex != null) {
        const replacedCard = this.getGameSession().getCardByIndex(this.replacedCardIndex);
        while ((indexOfCardInDeck == null) && (indices.length > 0)) {
          // get next index
          var index;
          if (!this.getGameSession().getAreDecksRandomized()) {
            index = indices.pop();
          } else {
            index = indices.splice(this.getGameSession().getRandomIntegerForExecution(indices.length), 1)[0];
          }

          // test whether card is valid to replace
          var cardIndex = drawPile[index];
          if (cardIndex !== replacedCard.getIndex()) {
            var potentialCard = this.getGameSession().getCardByIndex(cardIndex);
            if (potentialCard.getBaseCardId() !== replacedCard.getBaseCardId()) {
              // replace with card of a different id
              indexOfCardInDeck = index;
            }
          }
        }

        // default to top of deck
        if (indexOfCardInDeck == null) { indexOfCardInDeck = drawPile.length - 1; }

        // get the id of the card replacing
        this.cardDataOrIndex = drawPile[indexOfCardInDeck];
      }
    }

    // put replaced card back into deck
    this.getGameSession().applyCardToDeck(deck, this.replacedCardIndex, this.getGameSession().getCardByIndex(this.replacedCardIndex), this);

    // add the new card to hand
    return super._execute();
  }

  getIsForcedReplace() {
    return this.forcedReplace;
  }
}
ReplaceCardFromHandAction.initClass();

module.exports = ReplaceCardFromHandAction;
