/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const KillAction = require('app/sdk/actions/killAction');
const RemoveAction = require('app/sdk/actions/removeAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierStartTurnWatchBounceToActionBar extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchBounceToActionBar";
    this.type ="ModifierStartTurnWatchBounceToActionBar";
  
    this.prototype.maxStacks = 1;
  }

  onTurnWatch(action) {
    const thisEntity = this.getCard();
    if (__guard__(this.getCard(), x => x.getIsActive())) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(thisEntity.getOwnerId());
      removeOriginalEntityAction.setTarget(thisEntity);
      this.getGameSession().executeAction(removeOriginalEntityAction);

      // put a fresh card matching the original unit into hand
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), thisEntity.getOwnerId(), thisEntity.createNewCardData());
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierStartTurnWatchBounceToActionBar.initClass();

module.exports = ModifierStartTurnWatchBounceToActionBar;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}