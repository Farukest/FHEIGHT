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
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierTakeDamageWatchSpawnEntity extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchSpawnEntity";
    this.type ="ModifierTakeDamageWatchSpawnEntity";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Whenever this minion takes damage, summon %X nearby";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, spawnCount, spawnPattern, spawnSilently,options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnPattern == null) { spawnPattern = CONFIG.PATTERN_3x3; }
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

  onDamageTaken(action) {
    super.onDamageTaken(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const ownerId = this.getSpawnOwnerId(action);
      const spawnPositions = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsForModifier(this, ModifierTakeDamageWatchSpawnEntity);
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
ModifierTakeDamageWatchSpawnEntity.initClass();

module.exports = ModifierTakeDamageWatchSpawnEntity;
