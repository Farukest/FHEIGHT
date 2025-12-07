/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierKillWatch = require('./modifierKillWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Rarity = require('app/sdk/cards/rarityLookup');

class ModifierKillWatchSpawnCopyNearby extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchSpawnCopyNearby";
    this.type ="ModifierKillWatchSpawnCopyNearby";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onKillWatch(action) {
    super.onKillWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const cardDataOrIndexToSpawn = action.getTarget().createNewCardData();
      const cardToSpawn = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(cardDataOrIndexToSpawn);
      if (!cardToSpawn.getWasGeneral()) {
        const spawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, cardToSpawn, this.getCard(), 1);
        return (() => {
          const result = [];
          for (var spawnPosition of Array.from(spawnPositions)) {
            var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
            spawnAction.setSource(this.getCard());
            result.push(this.getGameSession().executeAction(spawnAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierKillWatchSpawnCopyNearby.initClass();

module.exports = ModifierKillWatchSpawnCopyNearby;
