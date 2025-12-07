/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const HealAction = require('app/sdk/actions/healAction');
const SpellKillTarget = require('./spellKillTarget');

class SpellMartyrdom extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const applyEffectPosition = {x, y};
    const target = board.getCardAtPosition(applyEffectPosition, this.targetType);
    const hpToHeal = target.getHP(); //keep track of how much HP target had before it was killed
    const general = this.getGameSession().getGeneralForPlayerId(target.getOwnerId());

    super.onApplyEffectToBoardTile(board,x,y,sourceAction); //kill the target unit

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SpellMartyrdom::onApplyEffectToBoardTile -> heal General for #{general.getOwnerId()}"

    //heal the General of the killed unit by that unit's current health (before the unit was killed)
    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.ownerId);
    healAction.setTarget(general);
    healAction.setHealAmount(hpToHeal);
    return this.getGameSession().executeAction(healAction);
  }
}

module.exports = SpellMartyrdom;
