/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CONFIG = require('app/common/config');

class PlayerModifierEndTurnRespawnEntityAnywhere extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEndTurnRespawnEntityAnywhere";
    this.type ="PlayerModifierEndTurnRespawnEntityAnywhere";
  
    this.isHiddenToUI = true;
    this.prototype.durationEndTurn = 1;
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onEndTurn(action) {
    super.onEndTurn(action);

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.cardDataOrIndexToSpawn != null)) {
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.PATTERN_WHOLE_BOARD, card);
      if (validSpawnLocations.length > 0) {
        const spawnLocation = validSpawnLocations[this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length)];
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getPlayer().getPlayerId(), spawnLocation.x, spawnLocation.y, this.cardDataOrIndexToSpawn);
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
PlayerModifierEndTurnRespawnEntityAnywhere.initClass();

module.exports = PlayerModifierEndTurnRespawnEntityAnywhere;
