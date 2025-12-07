/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');

/*
  Abstract class that should be the super class for ANY spell that applies entities to the board.
*/
class SpellApplyEntityToBoard extends Spell {
  static initClass() {
  
    this.prototype.sourceType = CardType.Entity;
    this.prototype.targetType = CardType.Entity;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.filterPlayPositionsForEntity = true;
     // by default SpellApplyEntity blocks play positions where the spawning entity would be obstructed
  }

  getEntityToSpawn() {
    // override in subclasses and provide entity that will be applied to board
    return null;
  }

  _postFilterPlayPositions(validPositions) {
    if (this.filterPlayPositionsForEntity) {
      const entity = this.getEntityToSpawn();
      if (entity != null) {
        const filteredPositions = [];
        for (var position of Array.from(validPositions)) {
          if (!this.getGameSession().getBoard().getObstructionAtPositionForEntity(position, entity)) {
            filteredPositions.push(position);
          }
        }
        return filteredPositions;
      } else {
        return super._postFilterPlayPositions(validPositions);
      }
    } else {
      return super._postFilterPlayPositions(validPositions);
    }
  }
}
SpellApplyEntityToBoard.initClass();

module.exports = SpellApplyEntityToBoard;
