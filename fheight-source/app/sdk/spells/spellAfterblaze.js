/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const ModifierBanding = require('app/sdk/modifiers/modifierBanding');

class SpellAfterblaze extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board, x, y, sourceAction); // apply modifier
    // draw a card if target had Zeal
    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);
    if (entity.hasModifierClass(ModifierBanding)) { // if unit has Zeal
      return this.getGameSession().executeAction(this.getOwner().getDeck().actionDrawCard());
    }
  }
}

module.exports = SpellAfterblaze;
