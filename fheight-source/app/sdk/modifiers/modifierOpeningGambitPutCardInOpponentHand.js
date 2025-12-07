/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOpeningGambitPutCardInOpponentHand extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitPutCardInOpponentHand";
    this.type ="ModifierOpeningGambitPutCardInOpponentHand";
  
    this.description ="Put %X in your opponent's action bar";
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

  onOpeningGambit(action) {
    super.onOpeningGambit(action);
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierOpeningGambitPutCardInOpponentHand.initClass();

module.exports = ModifierOpeningGambitPutCardInOpponentHand;
