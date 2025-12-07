/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish =  require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierDyingWishPutCardInHand extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishPutCardInHand";
    this.type ="ModifierDyingWishPutCardInHand";
  
    this.description ="Put %X in your Action Bar";
  
    this.prototype.cardDataOrIndexToPutInHand = null;
  }

  static createContextObject(cardDataOrIndexToPutInHand, cardDescription,options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    contextObject.cardDescription = cardDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.cardDescription);
    } else {
      return this.description;
    }
  }

  onDyingWish() {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierDyingWishPutCardInHand.initClass();

module.exports = ModifierDyingWishPutCardInHand;
