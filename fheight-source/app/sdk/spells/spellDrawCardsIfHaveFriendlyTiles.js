/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');

class SpellDrawCardsIfHaveFriendlyTiles extends Spell {
  static initClass() {
  
    this.prototype.numCardsToDraw = 0;
    this.prototype.numTilesRequired = 0;
    this.prototype.tileId = null;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    let numTiles = 0;
    return (() => {
      const result = [];
      for (var tile of Array.from(board.getTiles(true, false))) {
        if ((tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === this.tileId)) {
          numTiles++;
          if (numTiles >= this.numTilesRequired) {
            var player = this.getGameSession().getPlayerById(this.getOwnerId());
            for (var i = 0, end = this.numCardsToDraw, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
              var drawAction = player.getDeck().actionDrawCard();
              this.getGameSession().executeAction(drawAction);
            }
            break;
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
SpellDrawCardsIfHaveFriendlyTiles.initClass();

module.exports = SpellDrawCardsIfHaveFriendlyTiles;
