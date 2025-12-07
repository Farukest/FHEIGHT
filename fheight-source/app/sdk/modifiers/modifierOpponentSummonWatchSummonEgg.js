/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');

class ModifierOpponentSummonWatchSummonEgg extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchSummonEgg";
    this.type ="ModifierOpponentSummonWatchSummonEgg";
  
    this.modifierName ="Opponent Summon Watch Summon Egg";
    this.description = "Whenever your opponent summons a minion, summon an egg.";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentSummonWatch"];
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.eggName = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, eggName, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.eggName = eggName;
    return contextObject;
  }

  onSummonWatch(action) {
    super.onSummonWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, this.getCard());
      if (validSpawnLocations.length > 0) {
        const spawnLocation = validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0];
        const eggToSpawn = {id: Cards.Faction5.Egg};
        // add modifiers to card data
        if (eggToSpawn.additionalInherentModifiersContextObjects == null) { eggToSpawn.additionalInherentModifiersContextObjects = []; }
        eggToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(this.cardDataOrIndexToSpawn, this.eggName));
        const spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnLocation.x, spawnLocation.y, eggToSpawn);
        spawnAction.setSource(this.getCard());
        return this.getGameSession().executeAction(spawnAction);
      }
    }
  }
}
ModifierOpponentSummonWatchSummonEgg.initClass();

module.exports = ModifierOpponentSummonWatchSummonEgg;