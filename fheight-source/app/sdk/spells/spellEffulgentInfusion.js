/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const Modifier = require('app/sdk/modifiers/modifier');

class SpellEffulgentInfusion extends SpellApplyModifiers {
  static initClass() {
  
    this.prototype.appliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (general != null) {
      const attack = general.getATK();
      if (attack > 0) {
        const atkBuff = Modifier.createContextObjectWithAttributeBuffs(attack,0);
        atkBuff.appliedName = this.appliedName;
        this.targetModifiersContextObjects = [atkBuff];
        return super.onApplyEffectToBoardTile(board, x, y, sourceAction);
      }
    }
  }
}
SpellEffulgentInfusion.initClass();

module.exports = SpellEffulgentInfusion;
