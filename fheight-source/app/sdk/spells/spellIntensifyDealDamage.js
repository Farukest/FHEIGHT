/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellIntensify = require('./spellIntensify');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellIntensifyDealDamage extends SpellIntensify {
  static initClass() {
  
    this.prototype.damageAmount = 0;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, CardType.Unit);

    const totalDamageAmount = this.damageAmount * this.getIntensifyAmount();

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.ownerId);
    damageAction.setTarget(target);
    damageAction.setDamageAmount(totalDamageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
SpellIntensifyDealDamage.initClass();

module.exports = SpellIntensifyDealDamage;
