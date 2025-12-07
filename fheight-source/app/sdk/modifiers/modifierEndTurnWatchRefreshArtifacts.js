/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const RefreshArtifactChargesAction = require('app/sdk/actions/refreshArtifactChargesAction');

class ModifierEndTurnWatchRefreshArtifacts extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierEndTurnWatchRefreshArtifacts";
    this.type = "ModifierEndTurnWatchRefreshArtifacts";
  
    this.modifierName = "End Turn Watch";
    this.description = "At the end of your turn, repair all of your artifacts to full durability";
  }

  onTurnWatch() {
    const refreshArtifactChargesAction = new RefreshArtifactChargesAction(this.getCard().getGameSession());
    //target is your General
    refreshArtifactChargesAction.setTarget(this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()));
    refreshArtifactChargesAction.setSource(this.getCard());
    refreshArtifactChargesAction.setOwnerId(this.getCard().getOwnerId());
    return this.getCard().getGameSession().executeAction(refreshArtifactChargesAction);
  }
}
ModifierEndTurnWatchRefreshArtifacts.initClass();

module.exports = ModifierEndTurnWatchRefreshArtifacts;
