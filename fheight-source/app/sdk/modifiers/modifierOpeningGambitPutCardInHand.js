/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOpeningGambitPutCardInHand extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitPutCardInHand";
    this.type ="ModifierOpeningGambitPutCardInHand";
  
    this.prototype.cardDataOrIndexToPutInHand = null;
  }

  static createContextObject(cardDataOrIndexToPutInHand, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    return contextObject;
  }

  onOpeningGambit(action) {
    super.onOpeningGambit(action);
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierOpeningGambitPutCardInHand.initClass();

module.exports = ModifierOpeningGambitPutCardInHand;
