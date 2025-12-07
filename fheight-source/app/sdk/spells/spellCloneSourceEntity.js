/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellApplyEntityToBoard =   require('./spellApplyEntityToBoard');
const CloneEntityAction = require('app/sdk/actions/cloneEntityAction');

/*
  Spawns a new entity as clone of another entity.
*/
class SpellCloneSourceEntity extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.canBeAppliedAnywhere = false;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.followupSourcePattern = CONFIG.PATTERN_3x3; // only allow spawns within a 3x3 area of source position

    return p;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const spawnAction = this.getSpawnAction(x, y);
    if (spawnAction != null) {
      return this.getGameSession().executeAction(spawnAction);
    }
  }

  getSpawnAction(x, y) {
    const targetPosition = {x, y};
    const cloningEntity = this.getEntityToSpawn();
    if ((cloningEntity != null) && !this.getGameSession().getBoard().getObstructionAtPositionForEntity(targetPosition, cloningEntity)) {
      const spawnEntityAction = new CloneEntityAction(this.getGameSession(), this.getOwnerId(), x, y);
      spawnEntityAction.setOwnerId(this.getOwnerId());
      spawnEntityAction.setSource(cloningEntity);
      return spawnEntityAction;
    }
  }

  getEntityToSpawn() {
    const sourcePosition = this.getFollowupSourcePosition();
    if (sourcePosition != null) {
      return this.getGameSession().getBoard().getCardAtPosition(sourcePosition, this.targetType);
    }
  }
}
SpellCloneSourceEntity.initClass();

module.exports = SpellCloneSourceEntity;
