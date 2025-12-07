/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('../cards/cardType');
const ModifierOverwatchEndTurn = require('./modifierOverwatchEndTurn');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOverwatchEndTurnPutCardInHand extends ModifierOverwatchEndTurn {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchEndTurnPutCardInHand";
    this.type ="ModifierOverwatchEndTurnPutCardInHand";
  }

  static createContextObject(numCards, options) {
    if (numCards == null) { numCards = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.numCards = numCards;
    return contextObject;
  }

  onOverwatch(action) {
    return (() => {
      const result = [];
      for (let i = 0, end = this.numCards, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), {id: this.getCard().getId()});
        result.push(this.getGameSession().executeAction(a));
      }
      return result;
    })();
  }
}
ModifierOverwatchEndTurnPutCardInHand.initClass();

module.exports = ModifierOverwatchEndTurnPutCardInHand;
