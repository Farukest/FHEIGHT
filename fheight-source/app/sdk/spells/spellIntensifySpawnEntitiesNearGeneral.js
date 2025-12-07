/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellIntensify = require('./spellIntensify');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CONFIG = require('app/common/config');

class SpellIntensifySpawnEntitiesNearGeneral extends SpellIntensify {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.numberToSummon = 1;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.cardDataOrIndexToSpawn != null)) {

      const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
      const totalNumberToSpawn = this.numberToSummon * this.getIntensifyAmount();
      const card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), myGeneral.getPosition(), CONFIG.PATTERN_3x3, card, this, totalNumberToSpawn);

      return (() => {
        const result = [];
        for (var location of Array.from(spawnLocations)) {
          var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), location.x, location.y, this.cardDataOrIndexToSpawn);
          spawnAction.setSource(this);
          result.push(this.getGameSession().executeAction(spawnAction));
        }
        return result;
      })();
    }
  }
}
SpellIntensifySpawnEntitiesNearGeneral.initClass();

module.exports = SpellIntensifySpawnEntitiesNearGeneral;
