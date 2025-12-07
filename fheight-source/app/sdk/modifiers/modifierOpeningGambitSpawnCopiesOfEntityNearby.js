/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DieAction = require('app/sdk/actions/dieAction');
const CloneEntityAction = require('app/sdk/actions/cloneEntityAction');

class ModifierOpeningGambitSpawnCopiesOfEntityNearby extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitSpawnCopiesOfEntityNearby";
    this.type ="ModifierOpeningGambitSpawnCopiesOfEntityNearby";
  
    this.modifierName ="Opening Gambit";
    this.description = "Summon %X";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(spawnDescription, spawnCount, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = "";
      if (modifierContextObject.spawnCount === 1) {
        replaceText = ""+modifierContextObject.spawnDescription+" on a random nearby space";
        return this.description.replace(/%X/, replaceText);
      } else if (modifierContextObject.spawnCount > 1) {
        replaceText = ""+modifierContextObject.spawnDescription+" on random nearby spaces";
        return this.description.replace(/%X/, replaceText);
      }
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const spawnLocations = [];
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, this.getCard());
      for (let i = 0, end = this.spawnCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (validSpawnLocations.length > 0) {
          spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
        }
      }

      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction = new CloneEntityAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y);
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierOpeningGambitSpawnCopiesOfEntityNearby.initClass();

module.exports = ModifierOpeningGambitSpawnCopiesOfEntityNearby;
