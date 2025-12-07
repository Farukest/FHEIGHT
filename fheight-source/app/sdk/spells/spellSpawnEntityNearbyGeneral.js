const CONFIG = require('../../common/config');
const SpellSpawnEntity = require('./spellSpawnEntity');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');

/*
  Spawns a new entity nearby my general.
*/
class SpellSpawnEntityNearbyGeneral extends SpellSpawnEntity {

  _getPrefilteredValidTargetPositions() {
    // get positions around General
    return UtilsGameSession.getValidBoardPositionsFromPattern(this.getGameSession().getBoard(), this.getGameSession().getGeneralForPlayerId(this.ownerId).getPosition(), CONFIG.PATTERN_3x3);
  }
}

module.exports = SpellSpawnEntityNearbyGeneral;
