/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');
const Modifier = require('app/sdk/modifiers/modifier');
const _ = require('underscore');

class SpellDoubleAttackAndHealth extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.modifierAppliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);
    const healthModContextObject = Modifier.createContextObjectWithAttributeBuffs(entity.getATK(), entity.getHP());
    if (this.modifierAppliedName != null) {
      healthModContextObject.appliedName = this.modifierAppliedName;
    }
    return this.getGameSession().applyModifierContextObject(healthModContextObject, entity);
  }
}
SpellDoubleAttackAndHealth.initClass();

module.exports = SpellDoubleAttackAndHealth;
