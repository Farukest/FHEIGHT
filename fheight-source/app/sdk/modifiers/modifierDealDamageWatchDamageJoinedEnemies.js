/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierDealDamageWatchDamageJoinedEnemies extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchDamageJoinedEnemies";
    this.type ="ModifierDealDamageWatchDamageJoinedEnemies";
  
    this.modifierName ="Deal Damage to an enemy and all joined enemies";
    this.description ="Whenever this minion deals damage to an enemy, damage all joined enemies";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericChainLightning"];
  }

  onDealDamage(action) {

    const unit = action.getTarget();
    if ((unit != null) && (unit.getOwnerId() !== this.getCard().getOwnerId())) {

      const damagedPositions = [];
      const damageAmount = action.getDamageAmount();
      const position = unit.getPosition();
      damagedPositions.push(position);
      
      return this.damageEnemiesNearby(damageAmount, unit, damagedPositions);
    }
  }

  damageEnemiesNearby(damageAmount, unit, damagedPositions) {

    const enemiesNearby = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(unit, CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var enemy of Array.from(enemiesNearby)) {
        if (enemy != null) {
          var enemyPosition = enemy.getPosition();
          var alreadyDamaged = false;
          for (var position of Array.from(damagedPositions)) {
            if ((enemyPosition.x === position.x) && (enemyPosition.y === position.y)) {
              alreadyDamaged = true;
              break;
            }
          }
          if (!alreadyDamaged) {
            var damageAction = new DamageAction(this.getGameSession());
            damageAction.setOwnerId(this.getCard().getOwnerId());
            damageAction.setSource(this.getCard());
            damageAction.setTarget(enemy);
            damageAction.setDamageAmount(damageAmount);
            this.getGameSession().executeAction(damageAction);

            damagedPositions.push(enemyPosition);
            result.push(this.damageEnemiesNearby(damageAmount, enemy, damagedPositions));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierDealDamageWatchDamageJoinedEnemies.initClass();

module.exports = ModifierDealDamageWatchDamageJoinedEnemies;
