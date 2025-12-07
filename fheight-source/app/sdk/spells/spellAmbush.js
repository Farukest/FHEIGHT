/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellSpawnEntity =   require('./spellSpawnEntity');
const SpellFilterType = require('./spellFilterType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class SpellAmbush extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.None;
  
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction6.WyrBeast};
  
    this.prototype.unitsToSpawn = [
        {id: Cards.Faction6.WolfRaven},
        {id: Cards.Faction6.CrystalCloaker},
        {id: Cards.Faction6.WyrBeast},
        {id: Cards.Faction6.WyrBeast}
      ];
  
    this.prototype.timesApplied = 0;
     // we'll increment this each time we apply spawn a unit so we can grab each unit from the 'snow patrol'
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    if (this.unitsToSpawn.length > 0) {
      // get next unit to spawn
      const card = this.unitsToSpawn[this.timesApplied];
      this.timesApplied++;

      // spawn the card
      const spawnAction = this.getSpawnAction(x, y, card);
      if (spawnAction != null) {
        return this.getGameSession().executeAction(spawnAction);
      }
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    // spell summons units on enemy side of the board
    // begin with "my side" defined as whole board
    let enemySideStartX = 0;
    let enemySideEndX = CONFIG.BOARDCOL;
    const infiltratePattern = [];

    if (this.isOwnedByPlayer1()) {
      enemySideStartX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) + 1);
    } else if (this.isOwnedByPlayer2()) {
      enemySideEndX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) - 1);
    }

    for (position of Array.from(this.getGameSession().getBoard().getUnobstructedPositionsForEntity(this.getEntityToSpawn()))) {
      if ((position.x >= enemySideStartX) && (position.x <= enemySideEndX)) {
        infiltratePattern.push(position);
      }
    }

    const card = this.getEntityToSpawn();
    const applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, infiltratePattern, card, this, 4);

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellAmbush.initClass();

module.exports = SpellAmbush;
