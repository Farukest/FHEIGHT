/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierIntensify = require('./modifierIntensify');
const Modifier = require('./modifier');

class ModifierIntensifyBuffSelf extends ModifierIntensify {
  static initClass() {
  
    this.prototype.type ="ModifierIntensifyBuffSelf";
    this.type ="ModifierIntensifyBuffSelf";
  
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

    const totalAttackBuff = this.getIntensifyAmount() * this.attackBuff;
    const totalHealthBuff = this.getIntensifyAmount() * this.healthBuff;

    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(totalAttackBuff, totalHealthBuff);
    statContextObject.appliedName = this.modifierName;
    return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
  }
}
ModifierIntensifyBuffSelf.initClass();

module.exports = ModifierIntensifyBuffSelf;