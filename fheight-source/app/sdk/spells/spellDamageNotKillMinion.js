/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellDamageNotKillMinion extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, CardType.Unit);
    const damageAmount = target.getHP() - 1;

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.ownerId);
    damageAction.setTarget(target);
    damageAction.setDamageAmount(damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}

module.exports = SpellDamageNotKillMinion;
