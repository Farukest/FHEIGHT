/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSurviveDamageWatch =  require('./modifierSurviveDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const RemoveAction = require('app/sdk/actions/removeAction');

class ModifierSurviveDamageWatchReturnToHand extends ModifierSurviveDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSurviveDamageWatchReturnToHand";
    this.type ="ModifierSurviveDamageWatchReturnToHand";
  
    this.modifierName = "";
    this.description = "When this minion survives damage, it returns to your action bar";
  
    this.prototype.hasTriggered = false;
  }

  onSurviveDamage() {
    if (!this.hasTriggered) {
      this.hasTriggered = true;
      // remove unit from board
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeOriginalEntityAction.setTarget(this.getCard());
      this.getGameSession().executeAction(removeOriginalEntityAction);

      // put a fresh card matching the original unit into hand
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().createNewCardData());
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierSurviveDamageWatchReturnToHand.initClass();

module.exports = ModifierSurviveDamageWatchReturnToHand;
