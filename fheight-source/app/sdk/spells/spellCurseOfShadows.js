/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellCurseOfShadows extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    const attack = unit.getATK();

    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getOwnerId());
    damageAction.setTarget(enemyGeneral);
    damageAction.setDamageAmount(attack);
    return this.getGameSession().executeAction(damageAction);
  }
}

module.exports = SpellCurseOfShadows;