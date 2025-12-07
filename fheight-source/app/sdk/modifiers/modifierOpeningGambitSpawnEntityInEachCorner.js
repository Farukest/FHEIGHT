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
const ModifierOpeningGambit =   require('./modifierOpeningGambit');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierOpeningGambitSpawnEntityInEachCorner extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitSpawnEntityInEachCorner";
    this.type ="ModifierOpeningGambitSpawnEntityInEachCorner";
  
    this.description = "Summon %X";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnDescription = spawnDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.spawnDescription+" in each corner");
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = [];
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.PATTERN_CORNERS, card);
      for (let i = 0; i < 4; i++) {
        if (validSpawnLocations.length > 0) {
          spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
        }
      }

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
ModifierOpeningGambitSpawnEntityInEachCorner.initClass();

module.exports = ModifierOpeningGambitSpawnEntityInEachCorner;
