/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDeathWatch = require('./modifierDeathWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');
const Modifier = require('./modifier');

class ModifierDeathWatchGainAttackEqualToEnemyAttack extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchGainAttackEqualToEnemyAttack";
    this.type ="ModifierDeathWatchGainAttackEqualToEnemyAttack";
  
    this.modifierName ="Deathwatch";
    this.description ="When an enemy minion dies, gain attack equal to its attack";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericChain"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onDeathWatch(action) {
    //if the target is an enemy minion
    if (action.getTarget().getOwnerId() !== this.getCard().getOwnerId()) {
      const atkBuff = action.getTarget().getATK();
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(atkBuff,0);
      statContextObject.appliedName = "Upgraded module";
      return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
    }
  }
}
ModifierDeathWatchGainAttackEqualToEnemyAttack.initClass();

module.exports = ModifierDeathWatchGainAttackEqualToEnemyAttack;
