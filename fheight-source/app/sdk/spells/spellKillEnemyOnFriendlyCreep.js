/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellKillEnemyOnFriendlyCreep extends SpellKillTarget {

  _postFilterPlayPositions(spellPositions) {
    const board = this.getGameSession().getBoard();
    const possibleTargetPositions = [];

    for (var tile of Array.from(board.getTiles(true, false))) {
      if ((tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Shadow)) {
        var tilePosition = {x:tile.getPosition().x, y:tile.getPosition().y};
        var unitOnCreep = board.getCardAtPosition(tilePosition, CardType.Unit);
        if ((unitOnCreep != null) && (unitOnCreep.getOwnerId() !== this.getOwnerId()) && !unitOnCreep.getIsGeneral()) {
          possibleTargetPositions.push(tilePosition);
        }
      }
    }

    return possibleTargetPositions;
  }
}

module.exports = SpellKillEnemyOnFriendlyCreep;
