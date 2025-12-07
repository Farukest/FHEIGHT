/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const ForcedAttackAction = require('app/sdk/actions/forcedAttackAction');
const CardType = require('app/sdk/cards/cardType');

class SpellHomeostaticRebuke extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getUnitAtPosition({x, y});
    if ((typeof target.getATK === 'function' ? target.getATK() : undefined) > 0) {
      const attackAction = new ForcedAttackAction(this.getGameSession());
      attackAction.setOwnerId(this.ownerId);
      // source and target are same because minion deals damage to itself
      attackAction.setSource(target);
      attackAction.setTarget(target);
      attackAction.setDamageAmount(target.getATK());
      return this.getGameSession().executeAction(attackAction);
    }
  }
}

module.exports = SpellHomeostaticRebuke;
