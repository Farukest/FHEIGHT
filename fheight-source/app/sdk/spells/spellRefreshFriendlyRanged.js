/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellRefreshExhaustion = require('./spellRefreshExhaustion');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');

class SpellRefreshFriendlyRanged extends SpellRefreshExhaustion {

  _postFilterApplyPositions(validPositions) {

    const filteredPositions = [];

    const board = this.getGameSession().getBoard();
    for (var unit of Array.from(board.getUnits(true, false))) {
      if (((unit != null ? unit.getOwnerId() : undefined) === this.getOwnerId()) && !unit.getIsGeneral() && unit.hasActiveModifierClass(ModifierRanged)) {
        var position = unit.getPosition();
        filteredPositions.push(position);
      }
    }

    return filteredPositions;
  }
}

module.exports = SpellRefreshFriendlyRanged;