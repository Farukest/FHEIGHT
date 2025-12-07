/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatchSpawnEntity = require('./modifierEndTurnWatchSpawnEntity');

class ModifierEndTurnWatchSpawnRandomEntity extends ModifierEndTurnWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchSpawnRandomEntity";
    this.type ="ModifierEndTurnWatchSpawnRandomEntity";
  
    this.prototype.cardDataOrIndicesToSpawn = null;
     // array of card data objects or indices to pick randomly from
  }

  static createContextObject(cardDataOrIndicesToSpawn, spawnDescription, spawnCount, spawnPattern, spawnSilently, options) {
    const contextObject = super.createContextObject(cardDataOrIndicesToSpawn[0], spawnDescription, spawnCount, spawnPattern, spawnSilently, options);
    contextObject.cardDataOrIndicesToSpawn = cardDataOrIndicesToSpawn;
    return contextObject;
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndicesToSpawn[this.getGameSession().getRandomIntegerForExecution(this.cardDataOrIndicesToSpawn.length)];
  }
}
ModifierEndTurnWatchSpawnRandomEntity.initClass();

module.exports = ModifierEndTurnWatchSpawnRandomEntity;
