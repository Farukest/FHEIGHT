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
const HealAction = require('app/sdk/actions/healAction');

class SpellHealToFull extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.healModifier = 0;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);

    const healAction = new HealAction(this.getGameSession());
    healAction.manaCost = 0;
    healAction.setOwnerId(this.ownerId);
    healAction.setTarget(entity);
    healAction.setHealAmount(entity.getDamage());

    return this.getGameSession().executeAction(healAction);
  }
}
SpellHealToFull.initClass();

module.exports = SpellHealToFull;
