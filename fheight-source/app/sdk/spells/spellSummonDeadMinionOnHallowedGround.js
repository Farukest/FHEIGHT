/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellSummonDeadMinionOnHallowedGround extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.canBeAppliedAnywhere = false;
    this.prototype.spawnSilently = true;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.deadUnits = null;
    return p;
  }

  getDeadUnits() {
    if ((this._private.deadUnits == null)) {
      this._private.deadUnits = this.getGameSession().getDeadUnits(this.getOwnerId());
    }
    return this._private.deadUnits;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const entities = this.getDeadUnits();
      // find and spawn a dead unit
      if (entities.length > 0) {
        const entityToSpawn = entities[this.getGameSession().getRandomIntegerForExecution(entities.length)];
        if (entityToSpawn != null) {
          this.cardDataOrIndexToSpawn = entityToSpawn.createNewCardData();
          return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
        }
      }
    }
  }

  _postFilterPlayPositions(validPositions) {

    const board = this.getGameSession().getBoard();
    const possibleSummonPositions = [];

    for (var tile of Array.from(board.getTiles(true, false))) {
      if ((tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Hallowed)) {
        var tilePosition = {x:tile.getPosition().x, y:tile.getPosition().y};
        if (!board.getCardAtPosition(tilePosition, CardType.Unit)) {
          possibleSummonPositions.push(tilePosition);
        }
      }
    }

    // don't allow followup if there's nothing to re-summon or no unoccupied tiles
    if ((this.getDeadUnits().length > 0) && (possibleSummonPositions.length > 0)) {
      return super._postFilterPlayPositions(possibleSummonPositions);
    } else {
      return [];
    }
  }
}
SpellSummonDeadMinionOnHallowedGround.initClass();


module.exports = SpellSummonDeadMinionOnHallowedGround;
