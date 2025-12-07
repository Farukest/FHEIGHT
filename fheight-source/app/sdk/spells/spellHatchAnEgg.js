/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');

class SpellHatchAnEgg extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const eggModifier = board.getCardAtPosition({x, y}).getModifierByClass(ModifierEgg);
    if (eggModifier != null) {
      this.getGameSession().pushTriggeringModifierOntoStack(eggModifier);
      eggModifier.removeAndReplace();
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _postFilterPlayPositions(validPositions) {
    // playable anywhere where an egg exists
    // but NOT a dispelled egg (dispelled egg cannot hatch)
    const filteredPositions = [];
    for (var position of Array.from(validPositions)) {
      var entityAtPosition = this.getGameSession().getBoard().getEntityAtPosition(position);
      if ((entityAtPosition != null) && entityAtPosition.hasModifierClass(ModifierEgg)) {
        filteredPositions.push(position);
      }
    }
    return filteredPositions;
  }
}

module.exports = SpellHatchAnEgg;
