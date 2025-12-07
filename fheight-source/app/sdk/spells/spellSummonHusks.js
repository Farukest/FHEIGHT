/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class SpellSummonHusks extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const position = {x, y};
    const target = board.getCardAtPosition(position, CardType.Unit);
    if (target != null) {
      const attack = target.getATK();
      super.onApplyEffectToBoardTile(board,x,y,sourceAction);

      const entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData({id: Cards.Faction4.Husk});
      const spawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), position, CONFIG.PATTERN_3x3, entity, this, attack);
      if (spawnPositions != null) {
        for (var spawnPosition of Array.from(spawnPositions)) {
          var spawnEntityAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), spawnPosition.x, spawnPosition.y, {id: Cards.Faction4.Husk});
          this.getGameSession().executeAction(spawnEntityAction);
        }
      }
    }

    return true;
  }
}

module.exports = SpellSummonHusks;