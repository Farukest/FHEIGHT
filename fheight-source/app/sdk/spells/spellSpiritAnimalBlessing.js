/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellRefreshExhaustion = require('./spellRefreshExhaustion');
const SpellFilterType = require('./spellFilterType');

class SpellSpiritAnimalBlessing extends SpellRefreshExhaustion {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.AllyIndirect;
  }

  _postFilterApplyPositions(validPositions) {
    // spell kills units on 'your side' of the board
    let filteredPositions;
    if (validPositions.length > 0) {

      // begin with "opponent's side" defined as whole board
      let opponentSideStartX = 0;
      let opponentSideEndX = CONFIG.BOARDCOL;

      filteredPositions = [];

      if (this.isOwnedByPlayer2()) {
        opponentSideEndX = Math.floor(((opponentSideEndX - opponentSideStartX) * 0.5) - 1);

      } else if (this.isOwnedByPlayer1()) {
        opponentSideStartX = Math.floor(((opponentSideEndX - opponentSideStartX) * 0.5) + 1);
      }


      for (var position of Array.from(validPositions)) {
        if ((position.x >= opponentSideStartX) && (position.x <= opponentSideEndX)) {
          filteredPositions.push(position);
        }
      }
    }

    return filteredPositions;
  }
}
SpellSpiritAnimalBlessing.initClass();

module.exports = SpellSpiritAnimalBlessing;
