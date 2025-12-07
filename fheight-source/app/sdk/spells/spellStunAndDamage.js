/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const DamageAction = require('app/sdk/actions/damageAction');
const _ = require('underscore');

class SpellStunAndDamage extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    if (unit != null) {
      super.onApplyEffectToBoardTile(board,x,y,sourceAction);
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getOwnerId());
      damageAction.setTarget(unit);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}

module.exports = SpellStunAndDamage;
