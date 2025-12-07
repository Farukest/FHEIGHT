/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookup');

class SpellInklingSurge extends SpellSpawnEntity {

  onApplyToBoard(board,x,y,sourceAction) {

    for (var entity of Array.from(board.getEntities(true, false))) {
      if ((entity.getOwnerId() === this.getOwnerId()) && (entity.getBaseCardId() === Cards.Faction4.Wraithling)) {
        this.getGameSession().executeAction(this.getOwner().getDeck().actionDrawCard());
        break;
      }
    }

    return super.onApplyToBoard(board,x,y,sourceAction);
  }
}

module.exports = SpellInklingSurge;
