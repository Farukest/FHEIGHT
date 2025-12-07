/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellKillTarget = require('./spellKillTarget');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');

class SpellFollowupHollowGroveKeeper extends SpellKillTarget {

  _postFilterPlayPositions(validPositions) {
    // use super filter play positions
    validPositions = super._postFilterPlayPositions(validPositions);
    const filteredValidPositions = [];

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      // kill a target with provoke or frenzy
      if ((unit != null) && (unit.hasModifierClass(ModifierProvoke) || unit.hasModifierClass(ModifierFrenzy))) {
        filteredValidPositions.push(position);
      }
    }

    return filteredValidPositions;
  }

  // if the spell was able to be applied (if player targeted an appropriate minion)
  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    // apply frenzy and provoke to source unit
    const sourceUnit = this.getGameSession().getBoard().getUnitAtPosition(this.getFollowupSourcePosition());
    this.getGameSession().applyModifierContextObject(ModifierProvoke.createContextObject(), sourceUnit);
    return this.getGameSession().applyModifierContextObject(ModifierFrenzy.createContextObject(), sourceUnit);
  }
}

module.exports = SpellFollowupHollowGroveKeeper;
