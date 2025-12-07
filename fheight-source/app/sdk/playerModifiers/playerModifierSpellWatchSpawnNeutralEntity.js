/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierSpellWatch = require('./playerModifierSpellWatch');
const Factions = require('app/sdk/cards/factionsLookup');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

/*
  Summon watch that remains active whether the original entity dies or not.
*/
class PlayerModifierSpellWatchSpawnNeutralEntity extends PlayerModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierSpellWatchSpawnNeutralEntity";
    this.type ="PlayerModifierSpellWatchSpawnNeutralEntity";
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onSpellWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const originalCost = action.getCard().getManaCost();
      let newCost = originalCost + 3;

      const allMinions = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getType(CardType.Unit).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();

      if (allMinions != null) {
        let availableMinionAtCost = false;
        let possibleCards = [];
        while (!availableMinionAtCost && (newCost >= 0)) {
          var tempPossibilities = [];
          for (var minion of Array.from(allMinions)) {
            if ((minion != null ? minion.getManaCost() : undefined) === newCost) {
              possibleCards.push(minion);
            }
          }
          if (possibleCards.length > 0) {
            availableMinionAtCost = true;
          } else {
            possibleCards = [];
            newCost--;
          }
        }

        if (possibleCards.length > 0) {
          const newUnit = possibleCards[this.getGameSession().getRandomIntegerForExecution(possibleCards.length)];
          const ownerId = this.getPlayerId();
          const generalPosition = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()).getPosition();
          const spawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), generalPosition, CONFIG.PATTERN_3x3, newUnit, this.getCard(), 1);
          return (() => {
            const result = [];
            for (var spawnPosition of Array.from(spawnPositions)) {
              var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, newUnit);
              spawnAction.setSource(this.getCard());
              result.push(this.getGameSession().executeAction(spawnAction));
            }
            return result;
          })();
        }
      }
    }
  }
}
PlayerModifierSpellWatchSpawnNeutralEntity.initClass();


module.exports = PlayerModifierSpellWatchSpawnNeutralEntity;
