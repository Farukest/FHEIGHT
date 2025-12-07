/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookup');
const Spell = require('./spell');

class SpellWhisperOfTheSands extends Spell {

  onApplyOneEffectToBoard(board, x, y, sourceAction) {
    super.onApplyOneEffectToBoard(board, x, y, sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const ownerId = this.getOwnerId();

      // find cached copy of card to spawn
      const cardToSpawn = this.getGameSession().getCardCaches().getCardById(Cards.Faction3.Dervish);
      const cardDataToSpawn = cardToSpawn.createNewCardData();

      // gather all of player's obelysks
      const obelysks = [];
      const obelyskPositions = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if ((unit.getOwnerId() === ownerId) && this.isObelysk(unit)) {
          obelysks.push(unit);
          obelyskPositions.push(unit.getPosition());
        }
      }

      // coordinate spawning near all obelysks
      // this will generate spawn positions without conflicts whenever possible
      const spawnPositionsWithSource = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsFromPatterns(this.getGameSession(), obelyskPositions, CONFIG.PATTERN_3x3, cardToSpawn, obelysks);

      return (() => {
        const result = [];
        for (var spawnData of Array.from(spawnPositionsWithSource)) {
          var {
            spawnPositions
          } = spawnData;
          if (spawnPositions.length > 0) {
            var spawnPosition = spawnPositions[0];
            var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, cardDataToSpawn);
            spawnAction.setSource(this);
            result.push(this.getGameSession().executeAction(spawnAction));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  isObelysk(unit) {
    const unitId = unit.getBaseCardId();
    return (unitId === Cards.Faction3.BrazierRedSand) ||
        (unitId === Cards.Faction3.BrazierGoldenFlame) ||
        (unitId === Cards.Faction3.BrazierDuskWind) ||
        (unitId === Cards.Faction3.SoulburnObelysk) ||
        (unitId === Cards.Faction3.TrygonObelysk) ||
        (unitId === Cards.Faction3.LavastormObelysk) ||
        (unitId === Cards.Faction3.DuplicatorObelysk) ||
        (unitId === Cards.Faction3.SimulacraObelysk);
  }
}

module.exports = SpellWhisperOfTheSands;
