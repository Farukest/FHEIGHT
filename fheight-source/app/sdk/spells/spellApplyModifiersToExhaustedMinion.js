/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');

class SpellApplyModifiersToExhaustedMinion extends SpellApplyModifiers {

  _postFilterPlayPositions(validPositions) {
    const exhaustedMinionsPositions = [];

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      if ((unit != null) && (unit.getIsExhausted() === true)) {
        exhaustedMinionsPositions.push(position);
      }
    }

    return exhaustedMinionsPositions;
  }
}


module.exports = SpellApplyModifiersToExhaustedMinion;
