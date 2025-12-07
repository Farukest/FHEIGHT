/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellSpawnEntity = require('./spellSpawnEntity');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Rarity = require('app/sdk/cards/rarityLookup');

class SpellFollowupKeeper extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.canBeAppliedAnywhere = false;
    this.prototype.spawnSilently = true;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Neutral.KeeperOfTheVale};
     // default unit for spell positioning
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.followupSourcePattern = CONFIG.PATTERN_3x3; // only allow spawns within a 3x3 area of source position
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

  _postFilterPlayPositions(validPositions) {
    // don't allow followup if there's nothing to re-summon
    if (this.getDeadUnits().length > 0) {
      return super._postFilterPlayPositions(validPositions);
    } else {
      return [];
    }
  }
}
SpellFollowupKeeper.initClass();


module.exports = SpellFollowupKeeper;
