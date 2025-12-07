/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const ModifierStunnedVanar = require('app/sdk/modifiers/modifierStunnedVanar');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');

class SpellCreepingFrost extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getUnitAtPosition(applyEffectPosition);
    if (entity != null) {
      this.getGameSession().applyModifierContextObject(ModifierStunnedVanar.createContextObject(), entity);
    }

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const enemyUnits = board.getEnemyEntitiesForEntity(general, CardType.Unit, false, false);
    const additionalUnitsToStun = [];
    for (var unit of Array.from(enemyUnits)) {
      if (!unit.getIsGeneral() && (unit.hasActiveModifierClass(ModifierStunnedVanar) || unit.hasActiveModifierClass(ModifierStunned))) {
        var adjacentEnemies = board.getFriendlyEntitiesAroundEntity(unit, CardType.Unit, 1, true, false);
        var enemyToAdd = [];
        for (var enemy of Array.from(adjacentEnemies)) {
          if (!enemy.hasActiveModifierClass(ModifierStunnedVanar) && !enemy.hasActiveModifierClass(ModifierStunned)) {
            enemyToAdd.push(enemy);
          }
        }
        additionalUnitsToStun.push(enemyToAdd[this.getGameSession().getRandomIntegerForExecution(enemyToAdd.length)]);
      }
    }

    return Array.from(additionalUnitsToStun).map((unitToStun) =>
      this.getGameSession().applyModifierContextObject(ModifierStunnedVanar.createContextObject(), unitToStun));
  }
}

module.exports = SpellCreepingFrost;
