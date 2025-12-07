/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellDamage = require('./spellDamage');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const HealAction = require('app/sdk/actions/healAction');
const CONFIG = require('app/common/config');
const UtilsPosition = require('app/common/utils/utils_position');

class SpellLifeSurge extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const entity = board.getCardAtPosition({x, y}, this.targetType);

    // the minion to deal damage to (SpellDamage default effect)
    if (!(entity != null ? entity.isGeneral : undefined)) {
      return super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    // your General, gets healed
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

module.exports = SpellLifeSurge;
