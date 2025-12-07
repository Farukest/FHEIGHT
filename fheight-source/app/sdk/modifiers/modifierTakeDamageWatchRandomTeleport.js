/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const _ = require('underscore');

class ModifierTakeDamageWatchRandomTeleport extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchRandomTeleport";
    this.type ="ModifierTakeDamageWatchRandomTeleport";
  
    this.description ="Whenever this minion takes damage, it randomly teleports";
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
    randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
    randomTeleportAction.setSource(this.getCard());
    randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(randomTeleportAction);
  }
}
ModifierTakeDamageWatchRandomTeleport.initClass();

module.exports = ModifierTakeDamageWatchRandomTeleport;
