/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');

class SpellBreathOfTheUnborn extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
    this.prototype.damageAmount = 2;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const unit = board.getCardAtPosition(applyEffectPosition, this.targetType);
    if (unit != null) {
      if (!unit.getIsGeneral()) { // never affect Generals
        if (unit.getOwnerId() === this.getOwnerId()) { // friendly unit
          if (unit.getDamage() > 0) { // only heal if unit is damaged
            const healAction = new HealAction(this.getGameSession());
            healAction.setOwnerId(this.getOwnerId());
            healAction.setTarget(unit);
            healAction.setHealAmount(unit.getDamage()); // heal all damage dealt to this unit
            return this.getGameSession().executeAction(healAction);
          }
        } else {
          const damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getOwnerId());
          damageAction.setTarget(unit);
          damageAction.setDamageAmount(this.damageAmount);
          return this.getGameSession().executeAction(damageAction);
        }
      }
    }
  }
}
SpellBreathOfTheUnborn.initClass();

module.exports = SpellBreathOfTheUnborn;
