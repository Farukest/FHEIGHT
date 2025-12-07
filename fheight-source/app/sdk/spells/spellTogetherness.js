/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =  require('./spell');
const CardType = require('app/sdk/cards/cardType');

class SpellTogetherness extends Spell {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const unitsNearby = board.getEntitiesAroundEntity(general, CardType.Unit, 1, true, false);
    const player = this.getGameSession().getPlayerById(this.getOwnerId());

    return (() => {
      const result = [];
      for (var unit of Array.from(unitsNearby)) {
        if ((unit != null) && !unit.getIsGeneral() && (unit.getOwnerId() === this.getOwnerId())) {
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

module.exports = SpellTogetherness;