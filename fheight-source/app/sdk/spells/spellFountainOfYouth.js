/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const HealAction = require('app/sdk/actions/healAction');

class SpellFountainOfYouth extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.AllyIndirect;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const unit = board.getCardAtPosition(position, this.targetType);
    if (!unit.getIsGeneral()) { // heal my units, but not my General
      if (unit.getDamage() > 0) { // only heal if unit is damaged
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getOwnerId());
        healAction.setTarget(unit);
        healAction.setHealAmount(unit.getDamage()); // heal all damage dealt to this unit
        return this.getGameSession().executeAction(healAction);
      }
    }
  }
}
SpellFountainOfYouth.initClass();

module.exports = SpellFountainOfYouth;
