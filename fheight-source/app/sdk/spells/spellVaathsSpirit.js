/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('app/sdk/modifiers/modifier');
const SpellApplyModifiers = require('app/sdk/spells/spellApplyModifiers');

class SpellVaathsSpirit extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(1);
    statContextObject.appliedName = "Immortal Strength";
    return this.getGameSession().applyModifierContextObject(statContextObject, general);
  }
}

module.exports = SpellVaathsSpirit;