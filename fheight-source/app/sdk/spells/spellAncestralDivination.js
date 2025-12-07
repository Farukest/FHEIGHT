/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =  require('./spell');

class SpellAncestralDivination extends Spell {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    const player = this.getGameSession().getPlayerById(this.getOwnerId());

    // draw one card for each friendly minion on the board
    return (() => {
      const result = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if ((unit.getOwnerId() === this.getOwnerId()) && !unit.getIsGeneral()) {
          var action = player.getDeck().actionDrawCard();
          result.push(this.getGameSession().executeAction(action));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

module.exports = SpellAncestralDivination;
