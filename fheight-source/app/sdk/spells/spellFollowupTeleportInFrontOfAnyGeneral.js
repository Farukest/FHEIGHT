/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellFollowupTeleport = require('./spellFollowupTeleport');

class SpellFollowupTeleportInFrontOfAnyGeneral extends SpellFollowupTeleport {

  getFollowupSourcePattern() {
    const board = this.getGameSession().getBoard();
    const inFrontOfPositions = [];
    for (var unit of Array.from(board.getUnits())) {
      // apply in front of any General
      var playerOffset = 0;
      if (unit.getIsGeneral()) {
        if (unit.isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
        var entity = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
        var inFrontOfPosition = {x:unit.getPosition().x+playerOffset, y:unit.getPosition().y};
        if (board.isOnBoard(inFrontOfPosition) && !board.getObstructionAtPositionForEntity(inFrontOfPosition, entity)) {
          inFrontOfPositions.push(inFrontOfPosition);
        }
      }
    }

    const paternInFrontOfGenerals = [];
    for (var position of Array.from(inFrontOfPositions)) {
      paternInFrontOfGenerals.push({x: position.x - this.getFollowupSourcePosition().x, y: position.y - this.getFollowupSourcePosition().y});
    }

    return paternInFrontOfGenerals;
  }
}

module.exports = SpellFollowupTeleportInFrontOfAnyGeneral;
