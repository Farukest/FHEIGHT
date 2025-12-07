/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellKillTarget = require('./spellKillTarget');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellEggGrenade extends SpellKillTarget {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const applyEffectPosition = {x, y};
    const eggEntity = board.getUnitAtPosition(applyEffectPosition);
    const enemyEntities = board.getEnemyEntitiesAroundEntity(eggEntity, CardType.Unit, 1);

    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    return (() => {
      const result = [];
      for (var entity of Array.from(enemyEntities)) {
        var damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(eggEntity.getOwnerId());
        damageAction.setSource(this);
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(4);
        result.push(this.getGameSession().executeAction(damageAction));
      }
      return result;
    })();
  }

  _postFilterPlayPositions(validPositions) {
    const filteredPositions = [];
    for (var position of Array.from(validPositions)) {
      var entityAtPosition = this.getGameSession().getBoard().getEntityAtPosition(position);
      if ((entityAtPosition != null) && (entityAtPosition.getBaseCardId() === Cards.Faction5.Egg)) {
        filteredPositions.push(position);
      }
    }
    return filteredPositions;
  }
}


module.exports = SpellEggGrenade;
