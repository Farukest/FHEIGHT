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
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class ModifierEndTurnWatchSpawnEntity extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchSpawnEntity";
    this.type ="ModifierEndTurnWatchSpawnEntity";
  
    this.modifierName ="Turn Watch";
    this.description ="At the end of your turn, summon %X";
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.spawnDescription = null;
    this.prototype.spawnCount = null;
    this.prototype.spawnPattern = null;
    this.prototype.spawnSilently = false;
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericSpawn"];
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
      let replaceText = "";
      if (UtilsPosition.getArraysOfPositionsAreEqual(modifierContextObject.spawnPattern, CONFIG.PATTERN_1x1)) {
        replaceText = "a "+modifierContextObject.spawnDescription+" in the same space";
      } else if (modifierContextObject.spawnCount === 1) {
        replaceText = "a "+modifierContextObject.spawnDescription+" into a nearby space";
      } else if (modifierContextObject.spawnCount === 8) {
        replaceText = ""+modifierContextObject.spawnDescription+"s in all nearby spaces";
      } else {
        replaceText = ""+modifierContextObject.spawnDescription+"s into "+modifierContextObject.spawnCount+" nearby spaces";
      }
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const ownerId = this.getSpawnOwnerId(action);
      const spawnPositions = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsForModifier(this, ModifierEndTurnWatchSpawnEntity);
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

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  getSpawnOwnerId(action) {
    return this.getCard().getOwnerId();
  }
}
ModifierEndTurnWatchSpawnEntity.initClass();

module.exports = ModifierEndTurnWatchSpawnEntity;
