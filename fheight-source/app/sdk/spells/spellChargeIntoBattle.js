/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const CardType = require('app/sdk/cards/cardType');

class SpellChargeIntoBattle extends SpellApplyModifiers {

  _postFilterPlayPositions(validPositions) {
    // use super filter play positions
    let player1;
    validPositions = super._postFilterPlayPositions(validPositions);
    const filteredValidPositions = [];

    // find unit that is behind the general
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition();
    if (this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).isOwnedByPlayer1()) {
      player1 = true;
    } else {
      player1 = false;
    }

    for (var position of Array.from(validPositions)) {
      var unit = this.getGameSession().getBoard().getUnitAtPosition(position);
      if (player1 && ((unit != null ? unit.getPosition().x : undefined) === (generalPosition.x-1)) && (unit.getPosition().y === generalPosition.y)) {
        filteredValidPositions.push(unit.getPosition());
      }
      if (!player1 && ((unit != null ? unit.getPosition().x : undefined) === (generalPosition.x+1)) && (unit.getPosition().y === generalPosition.y)) {
        filteredValidPositions.push(unit.getPosition());
      }
    }

    return filteredValidPositions;
  }
}

module.exports = SpellChargeIntoBattle;
