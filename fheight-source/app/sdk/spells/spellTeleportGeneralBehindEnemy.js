/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const TeleportAction = require('app/sdk/actions/teleportAction');
const _ = require('underscore');

class SpellTeleportGeneralBehindEnemy extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const applyEffectPosition = {x, y};

    const source = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const teleAction = new TeleportAction(this.getGameSession());
    teleAction.setOwnerId(this.getOwnerId());
    teleAction.setSource(source);
    teleAction.setTargetPosition({x, y});
    teleAction.setFXResource(_.union(teleAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(teleAction);
  }

  _filterPlayPositions(spellPositions) {
    const teleportPositions = [];
    const board = this.getGameSession().getBoard();
    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    let playerOffset = 0;
    if (this.isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
    for (var unit of Array.from(board.getUnits())) {
      //look for units owned by the opponent of the player who cast the spell, and with an open space "behind" the enemy unit
      var behindPosition = {x:unit.getPosition().x+playerOffset, y:unit.getPosition().y};
      if ((unit.getOwnerId() !== this.getOwnerId()) && board.isOnBoard(behindPosition) && !board.getObstructionAtPositionForEntity(behindPosition, general)) {
        teleportPositions.push(behindPosition);
      }
    }

    return teleportPositions;
  }
}

module.exports = SpellTeleportGeneralBehindEnemy;
