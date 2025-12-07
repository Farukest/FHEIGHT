/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatchSpawnEntity = require('./modifierKillWatchSpawnEntity');

class ModifierKillWatchSpawnEnemyEntity extends ModifierKillWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchSpawnEnemyEntity";
    this.type ="ModifierKillWatchSpawnEnemyEntity";
  }

  getSpawnOwnerId(action) {
    return action.getTarget().getOwnerId();
  }
}
ModifierKillWatchSpawnEnemyEntity.initClass();

module.exports = ModifierKillWatchSpawnEnemyEntity;
