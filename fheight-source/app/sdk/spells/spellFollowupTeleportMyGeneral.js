/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellFollowupTeleport =  require('./spellFollowupTeleport');

class SpellFollowupTeleportMyGeneral extends SpellFollowupTeleport {

  getFollowupSourcePattern() {
    // since this spells teleports the General, we need to recenter the followup
    // source pattern on top of the General
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition();
    const xDif = this.getFollowupSourcePosition().x - generalPosition.x;
    const yDif = this.getFollowupSourcePosition().y - generalPosition.y;
    const patternAroundGeneral = [];
    for (var pos of Array.from(this.pattern)) {
      var finalPosition = {x:0, y:0};
      finalPosition.x = pos.x - xDif;
      finalPosition.y = pos.y - yDif;
      patternAroundGeneral.push(finalPosition);
    }
    return patternAroundGeneral;
  }

  getTeleportSourcePosition(applyEffectPosition) {
    return this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition();
  }
}

module.exports = SpellFollowupTeleportMyGeneral;
