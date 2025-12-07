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

class SpellDamage extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.EnemyDirect;
    this.prototype.damageAmount = 0;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, this.targetType);
    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SpellDamage::onApplyEffectToBoardTile -> #{@damageAmount} damage to #{target?.getLogName()} at #{x}, #{y}"

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.ownerId);
    damageAction.setTarget(target);
    damageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
SpellDamage.initClass();

module.exports = SpellDamage;
