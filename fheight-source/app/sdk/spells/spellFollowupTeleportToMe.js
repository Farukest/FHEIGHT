/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellFollowupTeleport = require('./spellFollowupTeleport');
const SpellFilterType = require('./spellFilterType');

class SpellFollowupTeleportToMe extends SpellFollowupTeleport {
  static initClass() {
  
    this.prototype._postFilterApplyPositions = this.prototype._postFilterPlayPositions;
  }

  getTeleportSourcePosition(applyEffectPosition) {
    return applyEffectPosition;
  }

  getTeleportTargetPosition(applyEffectPosition) {
    const source = this.getTeleportSource(this.getFollowupSourcePosition());
    if (source != null) {
      // set x offset based on which direction the source unit faces
      let offset;
      const sourcePosition = source.getPosition();
      if (source.isOwnedByPlayer1()) { offset = 1; } else { offset = -1; }
      return {x: sourcePosition.x + offset, y: sourcePosition.y};
    }
  }

  _postFilterPlayPositions(spellPositions) {
    // make sure that there is nothing at the target position
    if ((this.getTeleportTarget(this.getApplyEffectPosition()) == null)) {
      const validPositions = [];

      for (var position of Array.from(spellPositions)) {
        // make sure that there is something to teleport at the source position
        if (this.getGameSession().getBoard().getCardAtPosition(position, this.targetType) != null) {
          validPositions.push(position);
        }
      }

      return validPositions;
    } else {
      return [];
    }
  }

  static followupConditionCanTeleportToMe(cardWithFollowup, followupCard) {
    // make sure that there is nothing at in front of the target
    return !followupCard.getTeleportTarget(followupCard.getApplyEffectPosition());
  }
}
SpellFollowupTeleportToMe.initClass();

module.exports = SpellFollowupTeleportToMe;
