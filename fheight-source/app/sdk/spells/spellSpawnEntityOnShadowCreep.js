/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellSpawnEntityOnShadowCreep extends SpellSpawnEntity {

  _findApplyEffectPositions(position, sourceAction) {
    // filter to only positions with Shadow Creep
    const finalPositions = [];
    const board = this.getGameSession().getBoard();
    const entityToSpawn = this.getEntityToSpawn();
    for (var tile of Array.from(board.getTiles(true))) {
      if ((tile != null) && (tile.getBaseCardId() === Cards.Tile.Shadow) && (tile.getOwnerId() === this.getOwnerId())) {
        var pos = tile.getPosition();
        if (!board.getObstructionAtPositionForEntity(pos, entityToSpawn)) {
          finalPositions.push(pos);
        }
      }
    }

    return finalPositions;
  }
}

module.exports = SpellSpawnEntityOnShadowCreep;
