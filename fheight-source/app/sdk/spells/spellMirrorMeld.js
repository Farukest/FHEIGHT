/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellApplyEntityToBoard =  require('./spellApplyEntityToBoard');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CloneEntityAction = require('app/sdk/actions/cloneEntityAction');
const _ = require('underscore');

class SpellMirrorMeld extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.targetType = CardType.Entity;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const card = this.getGameSession().getBoard().getCardAtPosition({x, y}, this.targetType);
    const targetSpawnPosition = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x, y}, CONFIG.PATTERN_3x3, card, this, 1)[0];
    if (targetSpawnPosition != null) {
      const spawnAction = this.getSpawnAction(x, y, targetSpawnPosition);
      if (spawnAction != null) {
        return this.getGameSession().executeAction(spawnAction);
      }
    }
  }

  getSpawnAction(x, y, targetSpawnPosition) {
    const cloningEntity = this.getGameSession().getBoard().getCardAtPosition({x, y}, this.targetType);
    if ((cloningEntity != null) && !this.getGameSession().getBoard().getObstructionAtPositionForEntity(targetSpawnPosition, cloningEntity)) {
      const spawnEntityAction = new CloneEntityAction(this.getGameSession(), this.getOwnerId(), targetSpawnPosition.x, targetSpawnPosition.y);
      spawnEntityAction.setOwnerId(this.getOwnerId());
      spawnEntityAction.setSource(cloningEntity);
      return spawnEntityAction;
    }
  }

  _postFilterPlayPositions(validPositions) {
    const filteredPositions = [];

    if (validPositions.length > 0) {
      // spell only applies to minions with 2 or less cost
      for (var position of Array.from(validPositions)) {
        if (this.getGameSession().getBoard().getUnitAtPosition(position).getManaCost() <= 2) {
          filteredPositions.push(position);
        }
      }
    }

    return filteredPositions;
  }
}
SpellMirrorMeld.initClass();

module.exports = SpellMirrorMeld;
