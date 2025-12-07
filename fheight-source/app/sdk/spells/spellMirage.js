/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellApplyEntityToBoard =  require('./spellApplyEntityToBoard');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CloneEntityAction = require('app/sdk/actions/cloneEntityAction');
const ModifierMirage = require('app/sdk/modifiers/modifierMirage');

class SpellMirage extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.targetType = CardType.Entity;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const card = this.getGameSession().getBoard().getCardAtPosition({x, y}, this.targetType);
    const targetSpawnPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x, y}, CONFIG.PATTERN_3x3, card, this, 3);
    if (targetSpawnPositions.length > 0) {
      return (() => {
        const result = [];
        for (var position of Array.from(targetSpawnPositions)) {
          var spawnAction = this.getSpawnAction(x, y, position);
          if (spawnAction != null) {
            this.getGameSession().executeAction(spawnAction);
            result.push(this.getGameSession().applyModifierContextObject(ModifierMirage.createContextObject(), spawnAction.getCard()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
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
}
SpellMirage.initClass();

module.exports = SpellMirage;
