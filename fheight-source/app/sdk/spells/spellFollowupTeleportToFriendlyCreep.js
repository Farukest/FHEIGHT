/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellFollowupTeleport = require('./spellFollowupTeleport');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellFollowupTeleportToFriendlyCreep extends SpellFollowupTeleport {

  _postFilterPlayPositions(spellPositions) {
    const board = this.getGameSession().getBoard();
    const friendlyCreepPositions = [];

    for (var tile of Array.from(board.getTiles(true, false))) {
      if ((tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Shadow)) {
        var tilePosition = {x:tile.getPosition().x, y:tile.getPosition().y};
        if (!board.getCardAtPosition(tilePosition, CardType.Unit)) {
          friendlyCreepPositions.push(tilePosition);
        }
      }
    }

    return friendlyCreepPositions;
  }
}

module.exports = SpellFollowupTeleportToFriendlyCreep;
