/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWishSpawnEntity = require('./modifierDyingWishSpawnEntity');

class ModifierDyingWishDagona extends ModifierDyingWishSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDagona";
    this.type ="ModifierDyingWishDagona";
  
    this.prototype.spawnOwnerId = null;
  }

  createContextObjectForClone(contextObject) {
    const cloneContextObject = super.createContextObjectForClone(contextObject);
    cloneContextObject.spawnOwnerId = this.spawnOwnerId;
    cloneContextObject.cardDataOrIndexToSpawn = this.cardDataOrIndexToSpawn;
    return cloneContextObject;
  }

  setCardDataOrIndexToSpawn(cardDataOrIndexToSpawn) {
    return this.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
  }

  setSpawnOwnerId(ownerId) {
    return this.spawnOwnerId = ownerId;
  }

  getSpawnOwnerId(action) {
    if (this.spawnOwnerId != null) {
      return this.spawnOwnerId;
    } else {
      return super.getSpawnOwnerId(action);
    }
  }
}
ModifierDyingWishDagona.initClass();

module.exports = ModifierDyingWishDagona;
