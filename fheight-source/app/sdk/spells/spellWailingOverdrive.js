/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const CONFIG = require('app/common/config');

class SpellWailingOverdrive extends SpellApplyModifiers {

  _postFilterPlayPositions(validPositions) {
    const infiltratedPositions = [];

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      if ((unit != null) && this.getIsInfiltratedPosition(unit.getPosition())) {
        infiltratedPositions.push(position);
      }
    }

    return infiltratedPositions;
  }

  getIsInfiltratedPosition(position) {
    // infiltrate is active when this entity is on the enemy side of the battlefield (determined by player starting side)

    // begin with "my side" defined as whole board
    let enemySideStartX = 0;
    let enemySideEndX = CONFIG.BOARDCOL;

    if (this.isOwnedByPlayer1()) {
      enemySideStartX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) + 1);
    } else if (this.isOwnedByPlayer2()) {
      enemySideEndX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) - 1);
    }

    const {
      x
    } = position;
    return (x >= enemySideStartX) && (x <= enemySideEndX);
  }
}


module.exports = SpellWailingOverdrive;
