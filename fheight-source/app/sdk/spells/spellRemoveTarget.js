/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const RemoveAction = require('app/sdk/actions/removeAction');

class SpellRemoveTarget extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, this.targetType);
    if (target != null) {

      const removeAction = new RemoveAction(this.getGameSession());
      removeAction.setOwnerId(this.getOwnerId());
      removeAction.setTarget(target);
      return this.getGameSession().executeAction(removeAction);
    }
  }
}
SpellRemoveTarget.initClass();

module.exports = SpellRemoveTarget;