/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierStartTurnWatchPutCardInOpponentsHand extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchPutCardInOpponentsHand";
    this.type ="ModifierStartTurnWatchPutCardInOpponentsHand";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.description = "Add a card to your opponent's hand at start of turn";
  }

  static createContextObject(cardDataOrIndexToSpawn, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onTurnWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()).getOwnerId();
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), general, card);
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierStartTurnWatchPutCardInOpponentsHand.initClass();

module.exports = ModifierStartTurnWatchPutCardInOpponentsHand;
