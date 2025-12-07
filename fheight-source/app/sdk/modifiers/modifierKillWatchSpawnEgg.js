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
const ModifierKillWatch = require('./modifierKillWatch');
const ModifierEgg = require('./modifierEgg');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierKillWatchSpawnEgg extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchSpawnEgg";
    this.type ="ModifierKillWatchSpawnEgg";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch", "FX.Modifiers.ModifierGenericSpawn"];
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.minionName = null;
    this.prototype.numSpawns = 0;
    this.prototype.spawnPattern = null;
  }

  static createContextObject(includeAllies, includeGenerals, cardDataOrIndexToSpawn, minionName, numSpawns, spawnPattern, options) {
    if (includeAllies == null) { includeAllies = true; }
    if (includeGenerals == null) { includeGenerals = true; }
    const contextObject = super.createContextObject(includeAllies, includeGenerals, options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.minionName = minionName;
    contextObject.numSpawns = numSpawns;
    contextObject.spawnPattern = spawnPattern;
    return contextObject;
  }

  onKillWatch(action) {
    super.onKillWatch(action);

    const egg = {id: Cards.Faction5.Egg};
    if (egg.additionalInherentModifiersContextObjects == null) { egg.additionalInherentModifiersContextObjects = []; }
    egg.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(this.cardDataOrIndexToSpawn, this.minionName));

    const position = action.getTargetPosition();
    const cardToSpawn = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(egg);
    const spawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), position, this.spawnPattern, cardToSpawn, this.getCard(), this.numSpawns);

    if (spawnPositions != null) {
      return (() => {
        const result = [];
        for (var spawnPosition of Array.from(spawnPositions)) {
          var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnPosition.x, spawnPosition.y, egg);
          spawnAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(spawnAction));
        }
        return result;
      })();
    }
  }
}
ModifierKillWatchSpawnEgg.initClass();

module.exports = ModifierKillWatchSpawnEgg;
