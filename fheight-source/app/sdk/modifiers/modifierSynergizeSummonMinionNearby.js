/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierSynergize = require('./modifierSynergize');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierSynergizeSummonMinionNearby extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeSummonMinionNearby";
    this.type ="ModifierSynergizeSummonMinionNearby";
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.spawnCount = 1;
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnCount, options) {
    if (spawnCount == null) { spawnCount = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnCount = spawnCount;
    return contextObject;
  }

  onSynergize(action) {
    super.onSynergize(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = [];
      const validSpawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, card, this.getCard(), 8);
      for (let i = 0, end = this.spawnCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (validSpawnLocations.length > 0) {
          spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
        }
      }

      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierSynergizeSummonMinionNearby.initClass();

module.exports = ModifierSynergizeSummonMinionNearby;
