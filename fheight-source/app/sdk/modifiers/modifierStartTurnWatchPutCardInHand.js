/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const KillAction = require('app/sdk/actions/killAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierStartTurnWatchPutCardInHand extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchPutCardInHand";
    this.type ="ModifierStartTurnWatchPutCardInHand";
  
    this.prototype.cardData = null;
  
    this.description = "Add a card to your hand at start of turn";
  }

  static createContextObject(cardData, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardData = cardData;
    return contextObject;
  }

  onTurnWatch(action) {
    const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardData);
    return this.getGameSession().executeAction(putCardInHandAction);
  }
}
ModifierStartTurnWatchPutCardInHand.initClass();

module.exports = ModifierStartTurnWatchPutCardInHand;
