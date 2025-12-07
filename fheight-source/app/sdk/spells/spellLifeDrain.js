/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget.js');
const HealAction = require('app/sdk/actions/healAction');
const UtilsPosition = require('app/common/utils/utils_position');

class SpellLifeDrain extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const entity = board.getCardAtPosition({x, y}, this.targetType);

    // kill target
    if (!entity.isGeneral) {
      return super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    // heal your general
    } else {
      const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.getOwnerId());
      healAction.setTarget(general);
      healAction.setHealAmount(this.healAmount);
      return this.getGameSession().executeAction(healAction);
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = super._findApplyEffectPositions(position, sourceAction);

    // add your the General's position in as well
    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const generalPosition = general.getPosition();
    if (!UtilsPosition.getIsPositionInPositions(applyEffectPositions, generalPosition)) {
      applyEffectPositions.push(generalPosition);
    }

    return applyEffectPositions;
  }
}

module.exports = SpellLifeDrain;
