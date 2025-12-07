/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const RestoreChargeToAllArtifactsAction = require('app/sdk/actions/restoreChargeToAllArtifactsAction');

class ModifierStartTurnWatchRestoreChargeToArtifacts extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchRestoreChargeToArtifacts";
    this.type ="ModifierStartTurnWatchRestoreChargeToArtifacts";
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const restoreDurabilityAction = new RestoreChargeToAllArtifactsAction(this.getGameSession());
    restoreDurabilityAction.setTarget(myGeneral);
    return this.getCard().getGameSession().executeAction(restoreDurabilityAction);
  }
}
ModifierStartTurnWatchRestoreChargeToArtifacts.initClass();

module.exports = ModifierStartTurnWatchRestoreChargeToArtifacts;
