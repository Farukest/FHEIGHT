/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentDrawCardWatch = require('./modifierOpponentDrawCardWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');

class ModifierOpponentDrawCardWatchOverdrawSummonEntity extends ModifierOpponentDrawCardWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentDrawCardWatchOverdrawSummonEntity";
    this.type ="ModifierOpponentDrawCardWatchOverdrawSummonEntity";
  
    this.modifierName ="ModifierOpponentDrawCardWatchOverdrawSummonEntity";
    this.description = "Whenever your opponent overdraws, summon %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentDrawCardWatchBuffSelf", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, spawnCount, spawnPattern, spawnSilently, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnPattern == null) { spawnPattern = CONFIG.PATTERN_3x3; }
    if (spawnSilently == null) { spawnSilently = false; }
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
    //  if UtilsPosition.getArraysOfPositionsAreEqual(modifierContextObject.spawnPattern, CONFIG.PATTERN_1x1)
    //    replaceText = "a "+modifierContextObject.spawnDescription+" in the same space"
    //  else if modifierContextObject.spawnCount == 1
    //    replaceText = "a "+modifierContextObject.spawnDescription+" into a nearby space"
    //  else if modifierContextObject.spawnCount == 8
    //    replaceText = ""+modifierContextObject.spawnDescription+"s in all nearby spaces"
    //  else
    //    replaceText = ""+modifierContextObject.spawnDescription+"s into "+modifierContextObject.spawnCount+" nearby spaces"
      return this.description.replace(/%X/, modifierContextObject.spawnDescription);
    } else {
      return this.description;
    }
  }

  onDrawCardWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      if (action.getIsBurnedCard()) {
        const ownerId = this.getSpawnOwnerId(action);
        const spawnPositions = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsForModifier(this, ModifierOpponentDrawCardWatchOverdrawSummonEntity);
        return (() => {
          const result = [];
          for (var spawnPosition of Array.from(spawnPositions)) {
            var spawnAction;
            var cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn();
            if (this.spawnSilently) {
              spawnAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
            } else {
              spawnAction = new PlayCardAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
            }
            spawnAction.setSource(this.getCard());
            result.push(this.getGameSession().executeAction(spawnAction));
          }
          return result;
        })();
      }
    }
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  getSpawnOwnerId(action) {
    return this.getCard().getOwnerId();
  }
}
ModifierOpponentDrawCardWatchOverdrawSummonEntity.initClass();


module.exports = ModifierOpponentDrawCardWatchOverdrawSummonEntity;
