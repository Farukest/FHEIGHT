/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action =     require('./action');
const GameStatus =   require('app/sdk/gameStatus');
const Logger =     require('app/common/logger');
const CONFIG =     require('app/common/config');
const UtilsGameSession =     require('app/common/utils/utils_game_session');

const _ = require('underscore');

class DrawStartingHandAction extends Action {
  static initClass() {
  
    this.type ="DrawStartingHandAction";
  
    this.prototype.mulliganIndices =null;
    this.prototype.mulliganedHandCardsData =null;
    this.prototype.newHandCardsData =null;
  }

  constructor(gameSession, ownerId, mulliganIndices) {
    super(gameSession);
    if (this.type == null) { this.type = DrawStartingHandAction.type; }
    this.mulliganIndices = mulliganIndices || [];
    this.mulliganedHandCardsData = [];
    this.newHandCardsData = [];

    // has to be done after super()
    this.ownerId = ownerId + "";
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  _execute() {
    let card;
    const player = this.getGameSession().getPlayerById(this.getOwnerId());
    const deck = player.getDeck();
    const needsStartingHand = !player.getHasStartingHand();
    player.setHasStartingHand(true);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // always reset data on server
      this.mulliganedHandCardsData = [];
      this.newHandCardsData = [];

      if (this.getGameSession().isNew() && needsStartingHand && (this.mulliganIndices.length > 0) && (this.mulliganIndices.length <= CONFIG.STARTING_HAND_REPLACE_COUNT)) {
        //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "#{@.type}::execute -> computing starting hand. Mulligan indices [#{@mulliganIndices.toString()}]"
        // only allow draw starting hand for new game where this player does not yet have a starting hand
        let index;
        const hand = deck.getHand();
        const drawPile = deck.getDrawPile();

        // get all mulliganed cards as card data
        // card data is necessary or else drawing the starting hand won't work for replays
        this.newHandCardsData.length = hand.length;
        for (index of Array.from(this.mulliganIndices)) {
          card = deck.getCardInHandAtIndex(index);
          if (card != null) { this.mulliganedHandCardsData.push(card.createCardData()); }
        }

        if (this.mulliganedHandCardsData.length > 0) {
          // get all cards in deck to choose from
          const cardIndicesToChooseFrom = drawPile.slice(0);

          // when not enough cards remaining in deck to replace mulligan
          // add all cards to mulligan back into deck
          if (this.mulliganedHandCardsData.length > cardIndicesToChooseFrom.length) {
            for (var mulliganedCardData of Array.from(this.mulliganedHandCardsData)) {
              cardIndicesToChooseFrom.push(mulliganedCardData.index);
            }
            this.mulliganedHandCardsData.length = 0;
          }

          // choose cards for new hand
          if (cardIndicesToChooseFrom.length > 0) {
            for (index of Array.from(this.mulliganIndices)) {
              // redraw next card
              var indexInCards;
              if (!this.getGameSession().getAreDecksRandomized()) {
                indexInCards = cardIndicesToChooseFrom.length - 1;
              } else {
                indexInCards = this.getGameSession().getRandomIntegerForExecution(cardIndicesToChooseFrom.length);
              }
              var cardIndex = cardIndicesToChooseFrom[indexInCards];
              card = this.getGameSession().getCardByIndex(cardIndex);
              this.newHandCardsData[index] = card.createCardData();
              cardIndicesToChooseFrom.splice(indexInCards, 1);
            }
          }
        }
      }
    }

    if ((this.mulliganedHandCardsData.length > 0) && (this.newHandCardsData.length > 0)) {
      // return mulliganed cards to deck
      let cardData;
      for (cardData of Array.from(this.mulliganedHandCardsData)) {
        card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(cardData);
        this.getGameSession().applyCardToDeck(deck, cardData, card, this);
      }

      // apply new cards to hand
      return (() => {
        const result = [];
        for (let i = 0; i < this.newHandCardsData.length; i++) {
          cardData = this.newHandCardsData[i];
          if (cardData != null) {
            card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(cardData);
            result.push(this.getGameSession().applyCardToHand(deck, cardData, card, i, this));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  getMulliganIndices() {
    return this.mulliganIndices;
  }

  scrubSensitiveData(actionData,scrubFromPerspectiveOfPlayerId, forSpectator) {
    // scrub card ids and only retain card indices
    if (actionData.ownerId !== scrubFromPerspectiveOfPlayerId) {
      actionData.mulliganedHandCardsData = _.map(actionData.mulliganedHandCardsData, cardData => ({
        id:-1,
        index: cardData.index
      }));
      actionData.newHandCardsData = _.map(actionData.newHandCardsData, function(cardData) { if (cardData != null) { return {id:-1, index: cardData.index}; } else { return null; } });
    }
    return actionData;
  }
}
DrawStartingHandAction.initClass();

module.exports = DrawStartingHandAction;
