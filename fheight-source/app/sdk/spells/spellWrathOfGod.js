/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellWrathOfGod extends SpellKillTarget {

  _findApplyEffectPositions(position, sourceAction) {
    const potentialApplyEffectPositions = super._findApplyEffectPositions(position, sourceAction);
    const applyEffectPositions = [];
    const board = this.getGameSession().getBoard();

    for (position of Array.from(potentialApplyEffectPositions)) {
      var unit = board.getUnitAtPosition(position);
      if ((unit != null) && !unit.getIsGeneral()) {
        applyEffectPositions.push(position);
      }
    }

    return applyEffectPositions;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    if ((unit != null) && !unit.getIsGeneral()) {
      const action = new PlayCardAction(this.getGameSession(), this.getOwnerId(), x, y, {id: Cards.Tile.Hallowed});
      action.setOwnerId(this.getOwnerId());
      this.getGameSession().executeAction(action);
    }
    
    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}

module.exports = SpellWrathOfGod;