/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellApplyModifiers = require('./spellApplyModifiers');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');

class SpellLightningBlitz extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const unit = board.getCardAtPosition(applyEffectPosition, this.targetType);
    if (unit != null) {
      const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
      randomTeleportAction.setOwnerId(this.getOwnerId());
      randomTeleportAction.setSource(unit);
      if (unit.isOwnedByPlayer1()) { // if owned by player 1, we want to teleport onto player 2s side
        randomTeleportAction.setPatternSourcePosition({x: Math.ceil(CONFIG.BOARDCOL * 0.5), y:0});
      } else if (unit.isOwnedByPlayer2()) { // if owned by player 2, we want to teleport onto player 1s side
        randomTeleportAction.setPatternSourcePosition({x:0, y:0});
      }
      randomTeleportAction.setTeleportPattern(CONFIG.PATTERN_HALF_BOARD);
      return this.getGameSession().executeAction(randomTeleportAction);
    }
  }
}

module.exports = SpellLightningBlitz;
