/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellStunAndDamage = require('./spellStunAndDamage');
const SpellFilterType = require('./spellFilterType');

class SpellAvalanche extends SpellStunAndDamage {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
  }

  _postFilterApplyPositions(validPositions) {
    // spell kills units on 'your side' of the board
    let filteredPositions;
    if (validPositions.length > 0) {

      // begin with "my side" defined as whole board
      let mySideStartX = 0;
      let mySideEndX = CONFIG.BOARDCOL;

      filteredPositions = [];

      if (this.isOwnedByPlayer1()) {
        mySideEndX = Math.floor(((mySideEndX - mySideStartX) * 0.5) - 1);

      } else if (this.isOwnedByPlayer2()) {
        mySideStartX = Math.floor(((mySideEndX - mySideStartX) * 0.5) + 1);
      }


      for (var position of Array.from(validPositions)) {
        if ((position.x >= mySideStartX) && (position.x <= mySideEndX)) {
          filteredPositions.push(position);
        }
      }
    }

    return filteredPositions;
  }
}
SpellAvalanche.initClass();

module.exports = SpellAvalanche;
