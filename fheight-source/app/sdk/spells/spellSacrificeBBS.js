const SpellKillTarget = require('./spellKillTarget');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellSacrificeBBS extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getOwnerId());
    damageAction.setTarget(general);
    damageAction.setDamageAmount(2);
    this.getGameSession().executeAction(damageAction);

    return true;
  }
}

module.exports = SpellSacrificeBBS;