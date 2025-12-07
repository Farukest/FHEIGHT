/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');

class SpellSpawnEntitiesOnEdgeSpaces extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  _findApplyEffectPositions(position, sourceAction) {

    let i;
    const applyEffectPositions = [];

    for (i = 0; i <= 8; i++) {
      applyEffectPositions.push({x: i, y: 0});
      applyEffectPositions.push({x: i, y: 4});
    }

    for (i = 1; i <= 3; i++) {
      applyEffectPositions.push({x: 0, y: i});
      applyEffectPositions.push({x: 8, y: i});
    }

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellSpawnEntitiesOnEdgeSpaces.initClass();

module.exports = SpellSpawnEntitiesOnEdgeSpaces;