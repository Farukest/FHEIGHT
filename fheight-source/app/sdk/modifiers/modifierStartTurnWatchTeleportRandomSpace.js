/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class ModifierStartTurnWatchTeleportRandomSpace extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchTeleportRandomSpace";
    this.type ="ModifierStartTurnWatchTeleportRandomSpace";
  
    this.description = "At the start of your turn, teleport to a random location";
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
    randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
    randomTeleportAction.setSource(this.getCard());
    randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(randomTeleportAction);
  }
}
ModifierStartTurnWatchTeleportRandomSpace.initClass();

module.exports = ModifierStartTurnWatchTeleportRandomSpace;
