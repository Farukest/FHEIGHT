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

class SpellVoidPulse extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.damageAmount = 2;
    this.prototype.healAmount = 3;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const entity = board.getCardAtPosition(position, this.targetType);

    if ((entity != null) && entity.getIsGeneral()) {
      if (entity.getOwnerId() === this.getOwnerId()) {
        // heal my general
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getOwnerId());
        healAction.setTarget(entity);
        healAction.setHealAmount(this.healAmount);
        return this.getGameSession().executeAction(healAction);
      } else {
        // damage enemy general
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getOwnerId());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.damageAmount);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // only affects generals
    const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (enemyGeneral != null) { applyEffectPositions.push(enemyGeneral.getPosition()); }
    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (myGeneral != null) { applyEffectPositions.push(myGeneral.getPosition()); }

    return applyEffectPositions;
  }
}
SpellVoidPulse.initClass();

module.exports = SpellVoidPulse;
