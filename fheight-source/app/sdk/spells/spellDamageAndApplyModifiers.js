/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const DamageAction = require('app/sdk/actions/damageAction');
const _ = require('underscore');

class SpellDamageAndApplyModifiers extends SpellApplyModifiers {
  static initClass() {
  
    this.prototype.applyToAllies = false;
    this.prototype.applyToEnemy = false;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    if ((unit != null) && (!unit.getIsGeneral() || (unit.getIsGeneral() && this.canTargetGeneral))) {
      // deal damage
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getOwnerId());
      damageAction.setTarget(unit);
      damageAction.setDamageAmount(this.damageAmount);
      this.getGameSession().executeAction(damageAction);

      // apply modifiers
      if ((unit.getOwnerId() === this.getOwnerId()) && this.applyToAllies) {
        super.onApplyEffectToBoardTile(board,x,y,sourceAction);
      }
      if ((unit.getOwnerId() !== this.getOwnerId()) && this.applyToEnemy) {
        return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
      }
    }
  }
}
SpellDamageAndApplyModifiers.initClass();

module.exports = SpellDamageAndApplyModifiers;
