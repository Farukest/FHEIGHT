/*
 * decaffeinate suggestions:
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellDamage = require('./spellDamage');

class SpellWarbird extends SpellDamage {

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];
    const board = this.getGameSession().getBoard();
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId( this.getOwnerId());
    const generalPosition = general.getPosition();

    for (let i = 0, end = CONFIG.BOARDROW-1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
      var testPosition = {x: generalPosition.x, y: i};
      var entity = board.getUnitAtPosition(testPosition);
      if ((entity != null) && entity.getIsSameTeamAs(general)) {
        applyEffectPositions.push(entity.getPosition());
      }
    }

    return applyEffectPositions;
  }
}

module.exports = SpellWarbird;
