/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const CardType = require('./../cards/cardType.js');

class SpellSpawnEntityInFrontOfGeneral extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spawnSilently = true;
  }

  _findApplyEffectPositions(position, sourceAction) {
    const card = this.getEntityToSpawn();
    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    let applyEffectPositions = [];
    if (general != null) {
      let playerOffset = 0;
      if (this.isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
      const frontPosition = {x:general.getPosition().x+playerOffset, y:general.getPosition().y};
      if (this.getGameSession().getBoard().isOnBoard(frontPosition)) {
        applyEffectPositions = [frontPosition];
      }
    }

    return applyEffectPositions;
  }

  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellSpawnEntityInFrontOfGeneral.initClass();


module.exports = SpellSpawnEntityInFrontOfGeneral;
