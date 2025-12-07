/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const FightAction = require('app/sdk/actions/fightAction');

class SpellFollowupFight extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const enemyUnit = board.getCardAtPosition(applyEffectPosition, this.targetType);
    const originalUnit = board.getCardAtPosition(this.getFollowupSourcePosition(), this.targetType);
    if ((enemyUnit != null) && (originalUnit != null)) {
      const fightAction = new FightAction(this.getGameSession());
      fightAction.setOwnerId(this.getOwnerId());
      fightAction.setSource(originalUnit);
      fightAction.setTarget(enemyUnit);
      return this.getGameSession().executeAction(fightAction);
    }
  }
}
SpellFollowupFight.initClass();

module.exports = SpellFollowupFight;
