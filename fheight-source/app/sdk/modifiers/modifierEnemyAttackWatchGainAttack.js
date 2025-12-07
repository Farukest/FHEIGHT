/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyAttackWatch = require('./modifierEnemyAttackWatch');
const Modifier = require('./modifier');

class  ModifierEnemyAttackWatchGainAttack extends ModifierEnemyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyAttackWatchGainAttack";
    this.type ="ModifierEnemyAttackWatchGainAttack";
  
    this.prototype.attackBuff = 0;
    this.prototype.buffName = null;
  }

  static createContextObject(attackBuff, buffName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.attackBuff = attackBuff;
    contextObject.buffName = buffName;
    return contextObject;
  }

  onEnemyAttackWatch(action) {

    const target = action.getTarget();
    if ((target != null) && (target === this.getCard())) {
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(this.attackBuff);
      statContextObject.appliedName = this.buffName;
      return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
    }
  }
}
ModifierEnemyAttackWatchGainAttack.initClass();

module.exports = ModifierEnemyAttackWatchGainAttack;
