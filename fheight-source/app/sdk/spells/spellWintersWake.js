/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers.js');
const ModifierWall = require('app/sdk/modifiers/modifierWall');

class SpellWintersWake extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    // this should be only applying to Walls
    const card = this.getGameSession().getBoard().getCardAtPosition({x, y});
    const wallMod = card.getModifierByClass(ModifierWall);
    // allow this Wall to move
    if (wallMod != null) {
      wallMod.allowMove();
    }

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }

  _filterApplyPositions(spellPositions) {
    // applies only to Walls
    const applyEffectPositions = super._filterApplyPositions(spellPositions);
    const finalApplyEffectPositions = [];
    for (var position of Array.from(applyEffectPositions)) {
      var card = this.getGameSession().getBoard().getCardAtPosition(position);
      if (card.hasModifierClass(ModifierWall)) {
        finalApplyEffectPositions.push(position);
      }
    }
    return finalApplyEffectPositions;
  }
}

module.exports = SpellWintersWake;
