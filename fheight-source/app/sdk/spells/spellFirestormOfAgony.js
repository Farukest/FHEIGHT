/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =  require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');

class SpellFirestormOfAgony extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.healMultiplier = 2;
    this.prototype.damageMultiplier = 2;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const entity = board.getCardAtPosition(position, this.targetType);
    let spellCount = 0;

    // calculate number of spells you cast this turn
    let actions = [];
    for (var step of Array.from(this.getGameSession().getCurrentTurn().getSteps())) {
      actions = actions.concat(step.getAction().getFlattenedActionTree());
    }
    for (var action of Array.from(actions)) {
      if (action instanceof ApplyCardToBoardAction &&
      (__guard__(__guard__(action.getCard(), x2 => x2.getRootCard()), x1 => x1.getType()) === CardType.Spell) &&
      (action.getCard().getRootCard() === action.getCard()) &&
      !action.getIsImplicit() &&
      (action.getOwnerId() === this.getOwnerId())) {
        spellCount++;
      }
    }

    if ((entity != null) && entity.getIsGeneral()) {
      if (entity.getOwnerId() === this.getOwnerId()) {
        // heal my general
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getOwnerId());
        healAction.setTarget(entity);
        healAction.setHealAmount(this.healMultiplier * spellCount);
        return this.getGameSession().executeAction(healAction);
      } else {
        // damage enemy general
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getOwnerId());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.damageMultiplier * spellCount);
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
SpellFirestormOfAgony.initClass();

module.exports = SpellFirestormOfAgony;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}