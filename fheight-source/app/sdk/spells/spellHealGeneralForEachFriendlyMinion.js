/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellHealYourGeneral = require('./spellHealYourGeneral');

class SpellHealGeneralForEachFriendlyMinion extends SpellHealYourGeneral {
  static initClass() {
  
    this.prototype.healModifier = 0;
    this.prototype.healAmountPerMinion = 0;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    for (var unit of Array.from(board.getUnits(true, false))) {
      if (((unit != null ? unit.getOwnerId() : undefined) === this.getOwnerId()) && !unit.getIsGeneral()) {
        this.healModifier += this.healAmountPerMinion;
      }
    }

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }
}
SpellHealGeneralForEachFriendlyMinion.initClass();

module.exports = SpellHealGeneralForEachFriendlyMinion;