/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const RemoveRandomArtifactAction =  require('app/sdk/actions/removeRandomArtifactAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');


class ModifierOpeningGambitRemoveRandomArtifact extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitRemoveRandomArtifact";
    this.type = "ModifierOpeningGambitRemoveRandomArtifact";
  
    this.modifierName = "Opening Gambit";
    this.description = "Destroy a random enemy artifact";
  }

  onOpeningGambit() {
    const general = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    const modifiersByArtifact = general.getArtifactModifiersGroupedByArtifactCard();

    // if enemy General has at least one artifact on, then remove 1 artifact at random
    if (modifiersByArtifact.length > 0) {
      const removeArtifactAction = new RemoveRandomArtifactAction(this.getGameSession());
      removeArtifactAction.setTarget(general);
      return this.getGameSession().executeAction(removeArtifactAction);
    }
  }
}
ModifierOpeningGambitRemoveRandomArtifact.initClass();

module.exports = ModifierOpeningGambitRemoveRandomArtifact;
