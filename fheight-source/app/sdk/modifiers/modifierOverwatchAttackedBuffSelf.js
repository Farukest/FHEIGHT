/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierOverwatchAttacked = require('./modifierOverwatchAttacked');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierOverwatchAttackedBuffSelf extends ModifierOverwatchAttacked {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchAttackedBuffSelf";
    this.type ="ModifierOverwatchAttackedBuffSelf";
  
    this.description = "When this minion is attacked, it gains %X";
  }

  static createContextObject(attackBuff, maxHPBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statsBuff.appliedName = "Overwatcher's Preparation";
    contextObject.modifiersContextObjects = [statsBuff];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      return this.description.replace(/%X/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
    } else {
      return this.description;
    }
  }

  onOverwatch(action) {
    // apply all modifiers as un-managed
    // so they remain when this modifier is removed
    if (this.modifiersContextObjects != null) {
      const card = this.getCard();
      return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, card));
    }
  }
}
ModifierOverwatchAttackedBuffSelf.initClass();

module.exports = ModifierOverwatchAttackedBuffSelf;
