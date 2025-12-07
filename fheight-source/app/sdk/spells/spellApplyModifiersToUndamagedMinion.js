/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');

class SpellApplyModifiersToUndamagedMinion extends SpellApplyModifiers {

  _postFilterPlayPositions(validPositions) {
    const undamagedMinionsPositions = [];

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      if ((unit != null) && (unit.getHP() === unit.getMaxHP())) {
        undamagedMinionsPositions.push(position);
      }
    }

    return undamagedMinionsPositions;
  }
}


module.exports = SpellApplyModifiersToUndamagedMinion;