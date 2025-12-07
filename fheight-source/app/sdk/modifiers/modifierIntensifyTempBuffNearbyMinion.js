/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierIntensify = require('./modifierIntensify');
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');

class ModifierIntensifyTempBuffNearbyMinion extends ModifierIntensify {
  static initClass() {
  
    this.prototype.type ="ModifierIntensifyTempBuffNearbyMinion";
    this.type ="ModifierIntensifyTempBuffNearbyMinion";
  
    this.prototype.attackBuff = 0;
    this.prototype.healthBuff = 0;
    this.prototype.modifierName = null;
  }

  static createContextObject(attackBuff, healthBuff, modifierName, options) {
    const contextObject = super.createContextObject(options);
    contextObject.attackBuff = attackBuff;
    contextObject.healthBuff = healthBuff;
    contextObject.modifierName = modifierName;
    return contextObject;
  }

  onIntensify() {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const totalAttackBuff = this.getIntensifyAmount() * this.attackBuff;
      const totalHealthBuff = this.getIntensifyAmount() * this.healthBuff;
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(totalAttackBuff, totalHealthBuff);
      statContextObject.appliedName = this.modifierName;
      statContextObject.durationEndTurn = 1;

      const entities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
      const nearbyMinions = [];
      for (var entity of Array.from(entities)) {
        if ((entity != null) && !entity.getIsGeneral()) {
          nearbyMinions.push(entity);
        }
      }

      if (nearbyMinions.length > 0) {
        const minionToBuff = nearbyMinions[this.getGameSession().getRandomIntegerForExecution(nearbyMinions.length)];
        return this.getGameSession().applyModifierContextObject(statContextObject, minionToBuff);
      }
    }
  }
}
ModifierIntensifyTempBuffNearbyMinion.initClass();

module.exports = ModifierIntensifyTempBuffNearbyMinion;