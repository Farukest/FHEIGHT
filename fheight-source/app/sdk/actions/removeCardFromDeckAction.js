/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');

class RemoveCardFromDeckAction extends Action {
  static initClass() {
  
    this.type ="RemoveCardFromDeckAction";
  
    this.prototype.targetPlayerId = null;
    this.prototype.cardIndex = null;
  }

  constructor(gameSession, cardIndex, targetPlayerId) {
    super(gameSession);
    if (this.type == null) { this.type = RemoveCardFromDeckAction.type; }

    this.cardIndex = cardIndex;
    this.targetPlayerId = targetPlayerId;
  }

  _execute() {
    super._execute();

    if (this.cardIndex != null) {
      const deck = this.getGameSession().getPlayerById(this.targetPlayerId).getDeck();
      return this.getGameSession().removeCardByIndexFromDeck(deck, this.cardIndex, this.getGameSession().getCardByIndex(this.cardIndex), this);
    }
  }

  getCardIndex() {
    return this.cardIndex;
  }

  getTargetPlayerId() {
    return this.targetPlayerId;
  }
}
RemoveCardFromDeckAction.initClass();

module.exports = RemoveCardFromDeckAction;
