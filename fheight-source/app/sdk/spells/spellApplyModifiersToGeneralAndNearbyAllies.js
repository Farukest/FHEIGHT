/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const CardType = require('app/sdk/cards/cardType');

class SpellApplyModifiersToGeneralAndNearbyAllies extends SpellApplyModifiers {

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];
    const board = this.getGameSession().getBoard();

    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (myGeneral != null) {
      applyEffectPositions.push(myGeneral.getPosition());
      for (var entity of Array.from(board.getFriendlyEntitiesAroundEntity(myGeneral, CardType.Unit, 1))) {
        if (entity != null) {
          applyEffectPositions.push(entity.getPosition());
        }
      }
    }

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}

module.exports = SpellApplyModifiersToGeneralAndNearbyAllies;
