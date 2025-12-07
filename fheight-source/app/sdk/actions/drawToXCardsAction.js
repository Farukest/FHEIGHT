/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action =     require('./action');
const GameStatus =   require('app/sdk/gameStatus');
const Logger =     require('app/common/logger');

const _ = require('underscore');

class DrawToXCardsAction extends Action {
  static initClass() {
  
    this.type ="DrawToXCardsAction";
  
    this.prototype.cardCount =0;
  }

  constructor(gameSession,ownerId) {
    super(gameSession);
    if (this.type == null) { this.type = DrawToXCardsAction.type; }

    // has to be done after super()
    this.ownerId = ownerId + "";
  }

  setCardCount(cardCountToDrawTo) {
    return this.cardCount = cardCountToDrawTo;
  }

  _execute() {
    const player = this.getGameSession().getPlayerById(this.getOwnerId());
    const deck = player.getDeck();

    // draw enough cards to bring hand count to cardCount
    // if player does not have enough cards remaining in deck,
    // this will still draw X cards but will NOT draw cards forever
    const neededCards = this.cardCount - deck.getNumCardsInHand();
    if (neededCards > 0) {
      return __range__(0, neededCards, false).map((i) =>
        this.getGameSession().executeAction(deck.actionDrawCard()));
    }
  }
}
DrawToXCardsAction.initClass();


module.exports = DrawToXCardsAction;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}