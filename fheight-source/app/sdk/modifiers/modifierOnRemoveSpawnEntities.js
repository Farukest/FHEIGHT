/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Modifier = require('./modifier');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierOnRemoveSpawnEntities extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOnRemoveSpawnEntities";
    this.type ="ModifierOnRemoveSpawnEntities";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
  
    this.prototype.numSpawns = 0;
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(cardDataOrIndexToSpawn, numSpawns, options) {
    const contextObject = super.createContextObject(options);
    contextObject.numSpawns = numSpawns;
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onRemoveFromCard(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const cardToSpawn = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
      const spawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, cardToSpawn, this.getCard(), this.numSpawns);
      for (var spawnPosition of Array.from(spawnPositions)) {
        var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnPosition.x, spawnPosition.y, this.cardDataOrIndexToSpawn);
        spawnAction.setSource(this.getCard());
        this.getGameSession().executeAction(spawnAction);
      }
    }

    return super.onRemoveFromCard(action);
  }
}
ModifierOnRemoveSpawnEntities.initClass();

module.exports = ModifierOnRemoveSpawnEntities;
