/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellKillTarget = require('./spellKillTarget');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const _ = require('underscore');

class SpellDecimate extends SpellKillTarget {

  _postFilterApplyPositions(validPositions) {
    const filteredPositions = [];

    if (validPositions.length > 0) {
      // spell only applies to units not nearby a general
      const board = this.getGameSession().getBoard();
      const general1 = this.getGameSession().getGeneralForPlayer1();
      const general2 = this.getGameSession().getGeneralForPlayer2();
      const unitsAroundGenerals = _.uniq(_.union(board.getEntitiesAroundEntity(general1, this.targetType, 1), board.getEntitiesAroundEntity(general2, this.targetType, 1)));

      for (var position of Array.from(validPositions)) {
        var validPosition = true;
        for (var unit of Array.from(unitsAroundGenerals)) {
          if ((unit.position.x === position.x) && (unit.position.y === position.y)) {
            validPosition = false;
            break;
          }
        }

        if (validPosition) { filteredPositions.push(position); }
      }
    }

    return filteredPositions;
  }
}

module.exports = SpellDecimate;
