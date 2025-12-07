/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierIntensify = require('./modifierIntensify');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class ModifierIntensifySpawnEntitiesNearby extends ModifierIntensify {
  static initClass() {
  
    this.prototype.type = "ModifierIntensifySpawnEntitiesNearby";
    this.type = "ModifierIntensifySpawnEntitiesNearby";
  
    this.prototype.cardDataOrIndexToSpawn = 0;
    this.prototype.numToSpawn = 1;
  }

  static createContextObject(cardDataOrIndexToSpawn, numToSpawn, options) {
    if (numToSpawn == null) { numToSpawn = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.numToSpawn = numToSpawn;
    return contextObject;
  }

  onIntensify() {

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.cardDataOrIndexToSpawn != null)) {

      const totalNumberToSpawn = this.numToSpawn * this.getIntensifyAmount();
      const card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.cardDataOrIndexToSpawn);
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, card, this, totalNumberToSpawn);

      return (() => {
        const result = [];
        for (var location of Array.from(spawnLocations)) {
          var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), location.x, location.y, this.cardDataOrIndexToSpawn);
          spawnAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(spawnAction));
        }
        return result;
      })();
    }
  }
}
ModifierIntensifySpawnEntitiesNearby.initClass();

module.exports = ModifierIntensifySpawnEntitiesNearby;
