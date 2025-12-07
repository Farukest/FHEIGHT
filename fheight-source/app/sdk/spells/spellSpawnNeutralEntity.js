/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity =   require('./spellSpawnEntity');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellSpawnNeutralEntity extends SpellSpawnEntity {
  static initClass() {
    this.prototype.tileAsUnit = true;
     // true = treat tiles as units for valid spawn positions
  }

  getEntityToSpawn() {
    if (!this.tileAsUnit) {
      return super.getEntityToSpawn();
    } else {
      // return a unit instead of a tile so positioning methods will treat existing units as obstructing
      const entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData({id: Cards.Neutral.KomodoCharger});
      if (entity != null) {
        entity.setOwnerId(this.getOwnerId());
        return entity;
      }
    }
  }

  getSpawnAction(x, y, cardDataOrIndexToSpawn) {
    let spawnEntityAction;
    const targetPosition = {x, y};
    if ((cardDataOrIndexToSpawn == null)) { cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y); }
    const entity = this.getEntityToSpawn(cardDataOrIndexToSpawn);
    if (entity && !this.getGameSession().getBoard().getObstructionAtPositionForEntity(targetPosition, entity)) {
      if (this.spawnSilently) {
        spawnEntityAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), x, y, cardDataOrIndexToSpawn, true);
      } else {
        spawnEntityAction = new PlayCardAction(this.getGameSession(), this.getOwnerId(), x, y, cardDataOrIndexToSpawn, true);
      }
    }
    return spawnEntityAction;
  }
}
SpellSpawnNeutralEntity.initClass();

module.exports = SpellSpawnNeutralEntity;
