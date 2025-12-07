/*
 * decaffeinate suggestions:
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class SpellSpawnTilesInCenterColumn extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  _findApplyEffectPositions(position, sourceAction) {

    const board = this.getGameSession().getBoard();
    const centerPosition = {x: 4, y: 2};
    const applyEffectPositions = [];
    const validSpawnLocations = UtilsGameSession.getValidBoardPositionsFromPattern(board, centerPosition, CONFIG.PATTERN_WHOLE_COLUMN, true);
    if ((validSpawnLocations != null ? validSpawnLocations.length : undefined) > 0) {
      for (let i = 0, end = validSpawnLocations.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        applyEffectPositions.push(validSpawnLocations[i]);
      }
    }

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellSpawnTilesInCenterColumn.initClass();

module.exports = SpellSpawnTilesInCenterColumn;
