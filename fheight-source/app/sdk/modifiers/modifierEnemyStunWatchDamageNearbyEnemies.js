/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyStunWatch = require('./modifierEnemyStunWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEnemyStunWatchDamageNearbyEnemies extends ModifierEnemyStunWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyStunWatchDamageNearbyEnemies";
    this.type ="ModifierEnemyStunWatchDamageNearbyEnemies";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyMoveWatch"];
  
    this.prototype.damageAmount = 0;
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject();
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onEnemyStunWatch(action) {
    const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (entity != null) {
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(entity);
          damageAction.setDamageAmount(this.damageAmount);
          result.push(this.getGameSession().executeAction(damageAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierEnemyStunWatchDamageNearbyEnemies.initClass();

module.exports = ModifierEnemyStunWatchDamageNearbyEnemies;
