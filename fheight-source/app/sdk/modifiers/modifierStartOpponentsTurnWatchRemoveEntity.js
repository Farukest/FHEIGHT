/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartOpponentsTurnWatch = require('./modifierStartOpponentsTurnWatch');
const RemoveAction = require('app/sdk/actions/removeAction');

class ModifierStartOpponentsTurnWatchRemoveEntity extends ModifierStartOpponentsTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartOpponentsTurnWatchRemoveEntity";
    this.type ="ModifierStartOpponentsTurnWatchRemoveEntity";
  }

  onTurnWatch(action) {
    if (__guard__(this.getCard(), x => x.getIsActive())) {
      const removeEntityAction = new RemoveAction(this.getGameSession());
      removeEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeEntityAction.setTarget(this.getCard());
      removeEntityAction.setIsDepthFirst(true);
      return this.getGameSession().executeAction(removeEntityAction);
    }
  }
}
ModifierStartOpponentsTurnWatchRemoveEntity.initClass();

module.exports = ModifierStartOpponentsTurnWatchRemoveEntity;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}