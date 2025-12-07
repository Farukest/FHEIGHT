/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');

class SpellDamageOrHeal extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.damageOrHealAmount = 2;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, this.targetType);

    if (target.getOwnerId() === this.getOwnerId()) {
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.ownerId);
      healAction.setTarget(target);
      healAction.setHealAmount(this.damageOrHealAmount);
      return this.getGameSession().executeAction(healAction);
    } else {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.ownerId);
      damageAction.setTarget(target);
      damageAction.setDamageAmount(this.damageOrHealAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
SpellDamageOrHeal.initClass();

module.exports = SpellDamageOrHeal;
