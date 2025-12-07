/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierStartTurnWatchRespawnClones extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchRespawnClones";
    this.type ="ModifierStartTurnWatchRespawnClones";
  
    this.modifierName ="Turn Watch";
    this.description ="At the start of your turn, resummon fallen Legion in random corners.";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(spawnSilently, options) {
    if (spawnSilently == null) { spawnSilently = false; }
    const contextObject = super.createContextObject(options);
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const legion = [
      {id: Cards.Boss.Boss33_1},
      {id: Cards.Boss.Boss33_2},
      {id: Cards.Boss.Boss33_3},
      {id: Cards.Boss.Boss33_4}
    ];

    if (this.getCard().getIsGeneral() && this.getGameSession().getIsRunningAsAuthoritative()) { //to run more efficiently, only let the current general spawn the clones
      const cornerSpawnPattern = [{x: 0, y: 0}, {x: 0, y: CONFIG.BOARDROW-1}, {x: CONFIG.BOARDCOL-1, y: 0}, {x: CONFIG.BOARDCOL-1, y: CONFIG.BOARDROW-1}];
      return (() => {
        const result = [];
        while (legion.length > 0) {
          var randomIndex = this.getGameSession().getRandomIntegerForExecution(legion.length);
          var skipIndex = false;
          var skipSpawn = false;
          for (var existingUnit of Array.from(this.getGameSession().getBoard().getCards(CardType.Unit))) {
            if (legion.length > 0) {
              if (existingUnit.getBaseCardId() === legion[randomIndex].id) { // if we already have that particular clone on board...
                legion.splice(randomIndex, 1); //  ... then we can remove it from our array
                skipIndex = true;
                break;
              }
            }
          }
          if (skipIndex === false) {
            if (legion[randomIndex].id === Cards.Boss.Boss33_1) { // if it's the clone of the original general
              for (var existingUnits of Array.from(this.getGameSession().getBoard().getCards(CardType.Unit))) { // then check to see if original general is still on board
                if ((legion.length > 0) && (existingUnits.getBaseCardId() === Cards.Boss.Boss33)) { // if it is still on board...
                  legion.splice(randomIndex, 1); // then we don't want to add it on the board while the original general still lives
                  skipSpawn = true;  // so we skip the spawning phase
                  break;
                }
              }
            }
            if (skipSpawn === false) {
              this.cardDataOrIndexToSpawn = legion[randomIndex]; // if clone isn't on board, we have something we can spawn
              var card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
              var spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, cornerSpawnPattern, card, this.getCard(), 1);

              if (spawnLocations.length === 0) { // if there's no available respawn positions break this loop
                break;
              }
              var randomSpawnPositionIndex = this.getGameSession().getRandomIntegerForExecution(spawnLocations.length);
              var randomSpawnPosition = spawnLocations[randomSpawnPositionIndex];
              var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), randomSpawnPosition.x, randomSpawnPosition.y, this.cardDataOrIndexToSpawn);
              playCardAction.setSource(this.getCard());
              this.getGameSession().executeAction(playCardAction);
              result.push(legion.splice(randomIndex, 1));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierStartTurnWatchRespawnClones.initClass(); // now that the card has been played, remove it from the array

module.exports = ModifierStartTurnWatchRespawnClones;
