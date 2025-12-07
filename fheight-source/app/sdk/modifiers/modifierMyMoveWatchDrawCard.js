/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const ModifierMyMoveWatch = require('./modifierMyMoveWatch');

class ModifierMyMoveWatchDrawCard extends ModifierMyMoveWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyMoveWatchDrawCard";
    this.type ="ModifierMyMoveWatchDrawCard";
  
    this.description = "After this moves, draw %X";
  }

  static createContextObject(numCards) {
    if (numCards == null) { numCards = 1; }
    const contextObject = super.createContextObject();
    contextObject.numCards = numCards;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.numCards <= 1) {
        return this.description.replace(/%X/, "a card");
      } else {
        return this.description.replace(/%X/, modifierContextObject.numCards+" cards");
      }
    } else {
      return this.description;
    }
  }

  onMyMoveWatch(action) {
    super.onMyMoveWatch();

    return (() => {
      const result = [];
      for (let i = 0, end = this.numCards, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var deck = this.getGameSession().getPlayerById(this.getCard().getOwnerId()).getDeck();
        result.push(this.getCard().getGameSession().executeAction(deck.actionDrawCard()));
      }
      return result;
    })();
  }
}
ModifierMyMoveWatchDrawCard.initClass();


module.exports = ModifierMyMoveWatchDrawCard;
