/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellRefreshExhaustion = require('./spellRefreshExhaustion');
const SpellFilterType = require('./spellFilterType');

class SpellTimeMaelstrom extends SpellRefreshExhaustion {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.AllyIndirect;
    this.prototype.canTargetGeneral = true;
  }

  _postFilterApplyPositions(validPositions) {
    const ownGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const finalPositions = [];
    for (var position of Array.from(validPositions)) {
      if (this.getGameSession().getBoard().getCardAtPosition(position) === ownGeneral) {
        finalPositions.push(position);
      }
    }
    return finalPositions;
  }
}
SpellTimeMaelstrom.initClass();


module.exports = SpellTimeMaelstrom;
