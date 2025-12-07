/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');

class SpellSpawnEntitiesOnGeneralsDiagonals extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  _findApplyEffectPositions(position, sourceAction) {

    const applyEffectPositions = [];

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const generalPosition = general.getPosition();
    const upLeftPosition = {x: generalPosition.x - 1, y: generalPosition.y + 1};
    const downLeftPosition = {x: generalPosition.x - 1, y: generalPosition.y - 1};
    const upRightPosition = {x: generalPosition.x + 1, y: generalPosition.y + 1};
    const downRightPosition = {x: generalPosition.x + 1, y: generalPosition.y - 1};

    if ((upLeftPosition.x >= 0) && (upLeftPosition.y <= 4)) {
      applyEffectPositions.push(upLeftPosition);
    }
    if ((downLeftPosition.x >= 0) && (downLeftPosition.y >= 0)) {
      applyEffectPositions.push(downLeftPosition);
    }
    if ((upRightPosition.x <= 8) && (upRightPosition.y <= 4)) {
      applyEffectPositions.push(upRightPosition);
    }
    if ((downRightPosition.x <= 8) && (downRightPosition.y >= 0)) {
      applyEffectPositions.push(downRightPosition);
    }

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellSpawnEntitiesOnGeneralsDiagonals.initClass();

module.exports = SpellSpawnEntitiesOnGeneralsDiagonals;