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
const ModifierOnOpponentDeathWatch = require('./modifierOnOpponentDeathWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOnOpponentDeathWatchSpawnEntityOnSpace extends ModifierOnOpponentDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOnOpponentDeathWatchSpawnEntityOnSpace";
    this.type ="ModifierOnOpponentDeathWatchSpawnEntityOnSpace";
  
    this.modifierName ="Deathwatch";
    this.description ="Whenever an enemy minion dies, summon a %X";
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.spawnCount = 1;
    this.prototype.spawnSilently = true; // most reactive spawns should be silent, i.e. no followups and no opening gambits
    this.prototype.spawnPattern = CONFIG.PATTERN_1x1;
    this.prototype.prisonerList = [{id: Cards.Neutral.Prisoner1}, {id: Cards.Neutral.Prisoner2}, {id: Cards.Neutral.Prisoner3}, {id: Cards.Neutral.Prisoner4}, {id: Cards.Neutral.Prisoner5}, {id: Cards.Neutral.Prisoner6}];
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription,spawnCount, spawnPattern, spawnSilently,options) {
    if (spawnDescription == null) { spawnDescription = "prisoner"; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnPattern == null) { spawnPattern = CONFIG.PATTERN_1x1; }
    if (spawnSilently == null) { spawnSilently = true; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    contextObject.spawnPattern = spawnPattern;
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.spawnDescription);
    } else {
      return this.description;
    }
  }

  onDeathWatch(action) {
    super.onDeathWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      //if there's no defined card to summon, instead spawn a random prisoner
      if ((this.cardDataOrIndexToSpawn == null) || Array.from(this.prisonerList).includes(this.cardDataOrIndexToSpawn)) {
        this.cardDataOrIndexToSpawn = this.prisonerList[this.getGameSession().getRandomIntegerForExecution(this.prisonerList.length)];
      }

      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), action.getTargetPosition(), this.spawnPattern, card, this.getCard(), 1);
      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction;
          if (!this.spawnSilently) {
            playCardAction = new PlayCardAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          } else {
            playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          }
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  getSpawnOwnerId(action) {
    return this.getCard().getOwnerId();
  }
}
ModifierOnOpponentDeathWatchSpawnEntityOnSpace.initClass();

module.exports = ModifierOnOpponentDeathWatchSpawnEntityOnSpace;
