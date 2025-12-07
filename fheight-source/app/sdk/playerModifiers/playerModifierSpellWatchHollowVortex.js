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
const GameFormat = require('app/sdk/gameFormat');
const _ = require('underscore');

/*
  Summon watch that remains active whether the original entity dies or not.
*/
class PlayerModifierSpellWatchHollowVortex extends PlayerModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierSpellWatchHollowVortex";
    this.type ="PlayerModifierSpellWatchHollowVortex";
  
    this.isHiddenToUI = false;
  
    this.prototype.manaCostAddition = 0;
  }

  static createContextObject(manaCostAddition, options) {
    const contextObject = super.createContextObject(options);
    contextObject.manaCostAddition = manaCostAddition;
    return contextObject;
  }

  onSpellWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const originalCost = action.getCard().getManaCost();
      let newCost = originalCost + this.manaCostAddition;

      let neutralMinions = [];
      let factionMinions = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        neutralMinions = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Neutral).getType(CardType.Unit).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();
        factionMinions = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(this.getCard().getFactionId()).getType(CardType.Unit).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      } else {
        neutralMinions = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getType(CardType.Unit).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();
        factionMinions = this.getGameSession().getCardCaches().getFaction(this.getCard().getFactionId()).getType(CardType.Unit).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      }

      const allMinions = [].concat(factionMinions, neutralMinions);

      if (allMinions.length > 0) {
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
            newCost--;
          }
        }

        if ((possibleCards != null ? possibleCards.length : undefined) > 0) {
          // filter mythron cards
          possibleCards = _.reject(possibleCards, card => card.getRarityId() === 6);
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
PlayerModifierSpellWatchHollowVortex.initClass();

module.exports = PlayerModifierSpellWatchHollowVortex;
