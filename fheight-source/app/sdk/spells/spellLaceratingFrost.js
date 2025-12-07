/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');
const ModifierStunnedVanar = require('app/sdk/modifiers/modifierStunnedVanar');

class SpellLaceratingFrost extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.damageAmount = 2;
  }


  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const targetEntity = board.getCardAtPosition(applyEffectPosition, this.targetType);

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.ownerId);
    damageAction.setSource(this);
    damageAction.setTarget(targetEntity);
    damageAction.setDamageAmount(this.damageAmount);
    this.getGameSession().executeAction(damageAction);

    const entities = board.getFriendlyEntitiesAroundEntity(targetEntity, CardType.Unit, 1);
    return Array.from(entities).map((entity) =>
      this.getGameSession().applyModifierContextObject(ModifierStunnedVanar.createContextObject(), entity));
  }

  _postFilterPlayPositions(validPositions) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (general != null) {
      // apply spell on enemy General
      applyEffectPositions.push(general.getPosition());
    }

    return applyEffectPositions;
  }
}
SpellLaceratingFrost.initClass();

module.exports = SpellLaceratingFrost;
