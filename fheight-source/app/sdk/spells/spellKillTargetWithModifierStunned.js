/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellKillTarget = require('./spellKillTarget');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');

class SpellKillTargetWithModifierStunned extends SpellKillTarget {

  _postFilterPlayPositions(validPositions) {
    // use super filter play positions
    validPositions = super._postFilterPlayPositions(validPositions);
    const filteredValidPositions = [];

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      if ((unit != null) && unit.hasActiveModifierClass(ModifierStunned)) {
        filteredValidPositions.push(position);
      }
    }

    return filteredValidPositions;
  }
}

module.exports = SpellKillTargetWithModifierStunned;
