/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const ForcedAttackAction = require('app/sdk/actions/forcedAttackAction');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');

class ModifierMyAttackWatchGamble extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchGamble";
    this.type ="ModifierMyAttackWatchGamble";
  
    this.modifierName ="Attack Watch: Gamble";
    this.description ="Whenever this minion attacks, it has a 50% chance to attack again";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyAttackWatchGamble"];
  }

  onMyAttackWatch(action) {
    // 50% chance to attack again
    if (this.getGameSession().getIsRunningAsAuthoritative() && (Math.random() > .5)) {
      const attackAction = new ForcedAttackAction(this.getGameSession());
      attackAction.setOwnerId(this.getCard().getOwnerId());
      attackAction.setSource(this.getCard());
      attackAction.setDamageAmount(this.getCard().getATK());
      const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, CONFIG.WHOLE_BOARD_RADIUS);
      const validEntities = [];
      for (var entity of Array.from(entities)) {
        validEntities.push(entity);
      }

      if (validEntities.length > 0) {
        const unitToDamage = validEntities[this.getGameSession().getRandomIntegerForExecution(validEntities.length)];

        attackAction.setTarget(unitToDamage);
        attackAction.setIsAutomatic(true); // act like an explict attack even though this is auto generated
        return this.getGameSession().executeAction(attackAction); // execute attack
      }
    }
  }

  // special case - this needs to be able to react to attack actions that it creates (so it can keep chaining attacks)
  getCanReactToAction(action) {
    return super.getCanReactToAction() || (action instanceof ForcedAttackAction && this.getIsAncestorForAction(action));
  }
}
ModifierMyAttackWatchGamble.initClass();

module.exports = ModifierMyAttackWatchGamble;
