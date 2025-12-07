/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierFate = require('app/sdk/modifiers/modifierFate');

class SpellDinoParty extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      let isLockedFateCard, mod;
      const ownerId = this.getOwnerId();
      const general = this.getGameSession().getGeneralForPlayerId(ownerId);
      const cardsInHand = this.getOwner().getDeck().getCardsInHandExcludingMissing();
      const possibleCardsToSummon = [];
      for (var card of Array.from(cardsInHand)) {
        if ((card != null ? card.getType() : undefined) === CardType.Unit) {
          isLockedFateCard = false;
          if (card.hasActiveModifierClass(ModifierFate)) {
            for (mod of Array.from(card.getModifiersByClass(ModifierFate))) {
              if (!mod.fateConditionFulfilled()) {
                isLockedFateCard = true;
                break;
              }
            }
          }
          if (!isLockedFateCard) {
            possibleCardsToSummon.push(card);
          }
        }
      }

      const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(ownerId);
      const enemyId = enemyGeneral.getOwnerId();
      const enemyCardsInHand = this.getGameSession().getOpponentPlayerOfPlayerId(ownerId).getDeck().getCardsInHandExcludingMissing();
      const enemyPossibleCardsToSummon = [];
      for (var enemyCard of Array.from(enemyCardsInHand)) {
        if ((enemyCard != null ? enemyCard.getType() : undefined) === CardType.Unit) {
          isLockedFateCard = false;
          if (enemyCard.hasActiveModifierClass(ModifierFate)) {
            for (mod of Array.from(enemyCard.getModifiersByClass(ModifierFate))) {
              if (!mod.fateConditionFulfilled()) {
                isLockedFateCard = true;
                break;
              }
            }
          }
          if (!isLockedFateCard) {
            enemyPossibleCardsToSummon.push(enemyCard);
          }
        }
      }

      let minionsLeftToSummon = true;
      let enemyMinionsLeftToSummon = true;

      return (() => {
        const result = [];
        while (minionsLeftToSummon || enemyMinionsLeftToSummon) {
          if (minionsLeftToSummon) {
            minionsLeftToSummon = this.summonMinion(possibleCardsToSummon, general, ownerId);
          }
          if (enemyMinionsLeftToSummon) {
            result.push(enemyMinionsLeftToSummon = this.summonMinion(enemyPossibleCardsToSummon, enemyGeneral, enemyId));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  summonMinion(possibleCardsToSummon, general, ownerId) {

    if (possibleCardsToSummon.length > 0) {
      const generalPosition = general.getPosition();
      const cardToSummon = possibleCardsToSummon.splice(this.getGameSession().getRandomIntegerForExecution(possibleCardsToSummon.length), 1)[0];
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), generalPosition, CONFIG.PATTERN_3x3, cardToSummon, general, 1);

      if ((spawnLocations != null) && (spawnLocations.length > 0)) {
        const locationToSummon = spawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(spawnLocations.length), 1)[0];
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, locationToSummon.x, locationToSummon.y, cardToSummon.getIndex());
        playCardAction.setSource(general);
        this.getGameSession().executeAction(playCardAction);
        return true;
      }
    }
    return false;
  }
}

module.exports = SpellDinoParty;
