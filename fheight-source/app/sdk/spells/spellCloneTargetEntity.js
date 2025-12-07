/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsPosition = require('app/common/utils/utils_position');
const SpellRemoveAndReplaceEntity =   require('./spellRemoveAndReplaceEntity');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');
const _ = require('underscore');

/*
  Transforms an entity already on the board into a clone of another entity.
*/
class SpellCloneTargetEntity extends SpellRemoveAndReplaceEntity {

  getRemovePosition(applyEffectPosition) {
    return this.getFollowupSourcePosition();
  }

  getSpawnAction(x, y) {
    // clone should be taken from target location
    let spawnEntityAction;
    const cloningEntity = this.getEntityToSpawn(x, y);
    if (cloningEntity != null) {
      spawnEntityAction = new CloneEntityAsTransformAction(this.getGameSession(), this.getOwnerId(), x, y);
      spawnEntityAction.targetPosition = this.getFollowupSourcePosition();
      spawnEntityAction.setOwnerId(this.getOwnerId());
      spawnEntityAction.setSource(cloningEntity);
    }
    return spawnEntityAction;
  }

  getEntityToSpawn(x, y) {
    return this.getGameSession().getBoard().getCardAtPosition({x, y}, this.targetType);
  }

  getValidTargetPositions() {
    if ((this._private.cachedValidTargetPositions == null)) {
      // use original spell targeting
      const validPositions = super.getValidTargetPositions();
      // filter source position out as we shouldn't be copying ourselves
      const sourcePosition = this.getFollowupSourcePosition();
      if (sourcePosition) {
        this._private.cachedValidTargetPositions = _.reject(validPositions, position => UtilsPosition.getPositionsAreEqual(position, sourcePosition));
      }
    }
    return this._private.cachedValidTargetPositions;
  }
}

module.exports = SpellCloneTargetEntity;
