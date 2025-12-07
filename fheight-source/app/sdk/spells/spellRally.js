/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierBanding = require('app/sdk/modifiers/modifierBanding');
const CardType = require('app/sdk/cards/cardType');
const ModifierImmuneToSpellsByEnemy = require('app/sdk/modifiers/modifierImmuneToSpellsByEnemy');

class SpellRally extends Spell {
  static initClass() {
  
    this.prototype.buffName = null;
  }

  _findApplyEffectPositions(position, sourceAction) {
    const targetGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const targetGeneralPosition = targetGeneral.getPosition();

    const applyEffectPositions = [];
    if (this.getGameSession().getBoard().getUnitAtPosition({x: targetGeneralPosition.x + 1, y: targetGeneralPosition.y})) {
      applyEffectPositions.push({x: targetGeneralPosition.x + 1, y: targetGeneralPosition.y});
    }
    if (this.getGameSession().getBoard().getUnitAtPosition({x: targetGeneralPosition.x - 1, y: targetGeneralPosition.y})) {
      applyEffectPositions.push({x: targetGeneralPosition.x - 1, y: targetGeneralPosition.y});
    }
    return applyEffectPositions;
  }

  onApplyEffectToBoardTile(board, x, y, sourceAction) {
    super.onApplyEffectToBoardTile(board, x, y, sourceAction);

    const entity = board.getUnitAtPosition({x, y});
    if ((entity != null) && !entity.getIsGeneral() && (entity.getOwnerId() === this.getOwnerId())) {
      const buff = Modifier.createContextObjectWithAttributeBuffs(2, 2);
      buff.appliedName = this.buffName;
      this.getGameSession().applyModifierContextObject(buff, entity);
      if (entity.hasActiveModifierClass(ModifierBanding)) {
        return this.getGameSession().applyModifierContextObject(ModifierImmuneToSpellsByEnemy.createContextObject(), entity);
      }
    }
  }
}
SpellRally.initClass();

module.exports = SpellRally;
