/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellSunstrike extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const applyEffectPosition = {x, y};
    const entityAtPosition = this.getGameSession().getBoard().getEntityAtPosition(applyEffectPosition);

    if (entityAtPosition != null) {
      if (entityAtPosition.getOwnerId() === this.getOwnerId()) {
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getOwnerId());
        healAction.setTarget(entityAtPosition);
        healAction.setHealAmount(3);
        return this.getGameSession().executeAction(healAction);
      } else {
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getOwnerId());
        damageAction.setSource(this);
        damageAction.setTarget(entityAtPosition);
        damageAction.setDamageAmount(3);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }
}

module.exports = SpellSunstrike;
