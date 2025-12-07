/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWishSpawnEntity = require('./modifierDyingWishSpawnEntity');

class ModifierDyingWishSpawnRandomEntity extends ModifierDyingWishSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishSpawnRandomEntity";
    this.type ="ModifierDyingWishSpawnRandomEntity";
  
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
ModifierDyingWishSpawnRandomEntity.initClass();

module.exports = ModifierDyingWishSpawnRandomEntity;
