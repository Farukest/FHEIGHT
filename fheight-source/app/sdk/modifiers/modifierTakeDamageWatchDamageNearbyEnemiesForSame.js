/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDamageNearbyEnemiesForSame extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDamageNearbyEnemiesForSame";
    this.type ="ModifierTakeDamageWatchDamageNearbyEnemiesForSame";
  
    this.modifierName ="Take Damage Watch Damage Enemy For Same";
    this.description ="Whenever this minion takes damage, deal that much damage to all nearby enemies";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  onDamageTaken(action) {
    const damageAmount = action.getTotalDamageAmount();
    // deal same damage taken to all enemies
    return (() => {
      const result = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1))) {
        var damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(unit);
        damageAction.setDamageAmount(damageAmount);
        result.push(this.getGameSession().executeAction(damageAction));
      }
      return result;
    })();
  }
}
ModifierTakeDamageWatchDamageNearbyEnemiesForSame.initClass();

module.exports = ModifierTakeDamageWatchDamageNearbyEnemiesForSame;
