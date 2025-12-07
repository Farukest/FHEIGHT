/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Modifier = require('./modifier');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierOnRemoveSpawnRandomDeadEntity extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOnRemoveSpawnRandomDeadEntity";
    this.type ="ModifierOnRemoveSpawnRandomDeadEntity";
  
    this.modifierName ="ModifierOnRemoveSpawnRandomDeadEntity";
    this.description = "When this artifact breaks, summon the last friendly minion destroyed this game nearby";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onRemoveFromCard(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, this.getCard());
      if (validSpawnLocations.length > 0) {
        const spawnPosition = validSpawnLocations[this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length)];
        const deadUnits = this.getGameSession().getDeadUnits(this.getCard().getOwnerId());
        if (deadUnits.length > 0) {
          const cardDataOrIndexToSpawn = deadUnits[this.getGameSession().getRandomIntegerForExecution(deadUnits.length)].createNewCardData();
          const spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
          spawnAction.setSource(this.getCard());
          this.getGameSession().executeAction(spawnAction);
        }
      }
    }

    return super.onRemoveFromCard(action);
  }
}
ModifierOnRemoveSpawnRandomDeadEntity.initClass();


module.exports = ModifierOnRemoveSpawnRandomDeadEntity;
