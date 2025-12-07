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
const ModifierDyingWish =  require('./modifierDyingWish');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDyingWishSpawnEntityInCorner extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishSpawnEntityInCorner";
    this.type ="ModifierDyingWishSpawnEntityInCorner";
  
    this.description = "Summon %X";
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, spawnCount, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.spawnCount === 4) {
        return this.description.replace(/%X/, modifierContextObject.spawnDescription+" in each unoccupied corner");
      } else if (modifierContextObject.spawnCount === 1) {
        if (modifierContextObject.spawnDescription !== "a copy of this minion") {
          return this.description.replace(/%X/, modifierContextObject.spawnDescription+" in a random corner");
        } else {
          return "Re-summon this minion in a random corner";
        }
      } else {
        return this.description.replace(/%X/, modifierContextObject.spawnDescription+" in "+modifierContextObject.spawnCount+" random corners");
      }
    } else {
      return this.description;
    }
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const cornerSpawnPattern = [{x: 0, y: 0}, {x: 0, y: CONFIG.BOARDROW-1}, {x: CONFIG.BOARDCOL-1, y: 0}, {x: CONFIG.BOARDCOL-1, y: CONFIG.BOARDROW-1}];
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, cornerSpawnPattern, card, this.getCard(), this.spawnCount);

      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierDyingWishSpawnEntityInCorner.initClass();

module.exports = ModifierDyingWishSpawnEntityInCorner;
