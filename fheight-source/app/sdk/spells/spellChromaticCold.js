/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSilence = require('./spellSilence');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellChromaticCold extends SpellSilence {

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.targetsSpace = true; // does not target any unit directly
    return p;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction); // dispel the space

    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    if ((unit != null) && (unit.getOwnerId() !== this.getOwnerId())) { // damage enemies on this space
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getOwnerId());
      damageAction.setTarget(unit);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}


module.exports = SpellChromaticCold;
