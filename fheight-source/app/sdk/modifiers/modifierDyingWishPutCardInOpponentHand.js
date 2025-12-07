/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish =  require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierDyingWishPutCardInOpponentHand extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishPutCardInOpponentHand";
    this.type ="ModifierDyingWishPutCardInOpponentHand";
  
    this.prototype.cardDataOrIndexToPutInHand = null;
  }

  static createContextObject(cardDataOrIndexToPutInHand, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    return contextObject;
  }

  onDyingWish() {
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()).getOwnerId();
    const a = new PutCardInHandAction(this.getGameSession(), general, this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierDyingWishPutCardInOpponentHand.initClass();

module.exports = ModifierDyingWishPutCardInOpponentHand;
