/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierDealDamageWatchBuffSelf extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchBuffSelf";
    this.type ="ModifierDealDamageWatchBuffSelf";
  
    this.description = "Whenever this minion damages an enemy, this minion gains %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff, modAppliedName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (modAppliedName == null) { modAppliedName = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
        modifierName:this.modifierName,
        appliedName:modAppliedName,
        description:Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff),
      })
    ];
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

  onAfterDealDamage(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierDealDamageWatchBuffSelf.initClass();

module.exports = ModifierDealDamageWatchBuffSelf;
