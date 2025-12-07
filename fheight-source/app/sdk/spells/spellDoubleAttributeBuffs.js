/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('app/sdk/modifiers/modifier');

class SpellDoubleAttributeBuffs extends Spell {
  static initClass() {
  
    this.prototype.appliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, CardType.Unit);
    if (entity != null) {
      const attackDifference = entity.getATK(true) - entity.getBaseATK();
      const healthDifference = entity.getMaxHP(true) - entity.getBaseMaxHP();

      if ((attackDifference !== 0) || (healthDifference !== 0)) {
        const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(attackDifference, healthDifference);
        buffContextObject.appliedName = this.appliedName;
        return this.getGameSession().applyModifierContextObject(buffContextObject, entity);
      }
    }
  }
}
SpellDoubleAttributeBuffs.initClass();

module.exports = SpellDoubleAttributeBuffs;
