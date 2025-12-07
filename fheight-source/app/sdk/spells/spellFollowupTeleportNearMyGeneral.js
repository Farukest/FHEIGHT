/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellFollowupTeleport = require('./spellFollowupTeleport');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class SpellFollowupTeleportNearMyGeneral extends SpellFollowupTeleport {

  _postFilterPlayPositions(spellPositions) {
    // make sure that there is something to teleport at the source position
    if (this.getTeleportSource(this.getApplyEffectPosition()) != null) {
      const validPositions = [];

      const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
      if (general != null) {
        const teleportLocations = UtilsGameSession.getValidBoardPositionsFromPattern(this.getGameSession().getBoard(), general.getPosition(), CONFIG.PATTERN_3x3, false);
        for (var position of Array.from(teleportLocations)) {
          validPositions.push(position);
        }
      }

      return validPositions;
    } else {
      return [];
    }
  }
}

module.exports = SpellFollowupTeleportNearMyGeneral;
