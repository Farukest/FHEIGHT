/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =  require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellEmbryoticInsight extends Spell {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    const player = this.getGameSession().getPlayerById(this.getOwnerId());

    return (() => {
      const result = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if ((unit.getOwnerId() === this.getOwnerId()) && !unit.getIsGeneral() && (unit.getBaseCardId() === Cards.Faction5.Egg)) {
          var drawAction1 = player.getDeck().actionDrawCard();
          this.getGameSession().executeAction(drawAction1);
          var drawAction2 = player.getDeck().actionDrawCard();
          this.getGameSession().executeAction(drawAction2);
          break;
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

module.exports = SpellEmbryoticInsight;
