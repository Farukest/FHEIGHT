/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellRequireUnoccupiedFriendlyCreep extends Spell {

  _postFilterPlayPositions(spellPositions) {

    const board = this.getGameSession().getBoard();

    for (var tile of Array.from(board.getTiles(true, false))) {
      if ((tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Shadow)) {
        var tilePosition = {x:tile.getPosition().x, y:tile.getPosition().y};
        if (!board.getCardAtPosition(tilePosition, CardType.Unit)) {
          //there is at least 1 unoccupied friendly creep tile
          return super._postFilterPlayPositions(spellPositions);
        }
      }
    }

    //No unoccupied friendly creep
    return [];
  }
}

module.exports = SpellRequireUnoccupiedFriendlyCreep;
