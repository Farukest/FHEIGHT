/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSynergizeDamageClosestEnemy extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeDamageClosestEnemy";
    this.type ="ModifierSynergizeDamageClosestEnemy";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize", "FX.Modifiers.ModifierGenericDamage"];
  
    this.prototype.damageAmount = 0;
  }

  static createContextObject(damageAmount, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onSynergize(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let bestAbsoluteDistance = 9999;
      let potentialTargets = [];
      for (var potentialTarget of Array.from(this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard(), CardType.Unit))) {
        if (potentialTarget != null ? potentialTarget.getIsActive() : undefined) {
          var absoluteDistance = Math.abs(this.getCard().position.x - potentialTarget.position.x) + Math.abs(this.getCard().position.y - potentialTarget.position.y);
          // found a new best target
          if (absoluteDistance < bestAbsoluteDistance) {
            bestAbsoluteDistance = absoluteDistance;
            potentialTargets = []; // reset potential targets
            potentialTargets.push(potentialTarget);
            //found an equally good target
          } else if (absoluteDistance === bestAbsoluteDistance) {
            potentialTargets.push(potentialTarget);
          }
        }
      }

      if (potentialTargets.length > 0) {
        // choose randomly between all equally close enemies
        const target = potentialTargets[this.getGameSession().getRandomIntegerForExecution(potentialTargets.length)];
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(target);
        damageAction.setDamageAmount(this.damageAmount);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }
}
ModifierSynergizeDamageClosestEnemy.initClass();

module.exports = ModifierSynergizeDamageClosestEnemy;
