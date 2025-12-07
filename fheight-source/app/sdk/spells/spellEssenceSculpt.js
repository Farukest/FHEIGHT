/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellEssenceSculpt extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getUnitAtPosition({x, y});

    // put a fresh card matching the original unit into hand
    const newCardData = target.createNewCardData();
    // add additional modifiers as needed
    if (this.targetModifiersContextObjects) {
      if (newCardData.additionalModifiersContextObjects != null) {
        newCardData.additionalModifiersContextObjects.concat(UtilsJavascript.deepCopy(this.targetModifiersContextObjects));
      } else {
        newCardData.additionalModifiersContextObjects = UtilsJavascript.deepCopy(this.targetModifiersContextObjects);
      }
    }

    const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), newCardData);
    return this.getGameSession().executeAction(a);
  }

  _postFilterPlayPositions(validPositions) {
    const filteredPositions = [];
    for (var position of Array.from(validPositions)) {
      var entityAtPosition = this.getGameSession().getBoard().getEntityAtPosition(position);
      if ((entityAtPosition != null) && entityAtPosition.hasModifierClass(ModifierStunned)) {
        filteredPositions.push(position);
      }
    }
    return filteredPositions;
  }
}

module.exports = SpellEssenceSculpt;
