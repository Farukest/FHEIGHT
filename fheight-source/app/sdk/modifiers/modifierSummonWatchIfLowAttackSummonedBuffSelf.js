/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const Modifier = require('./modifier');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSummonWatchIfLowAttackSummonedBuffSelf extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchIfLowAttackSummonedBuffSelf";
    this.type ="ModifierSummonWatchIfLowAttackSummonedBuffSelf";
  
    this.modifierName ="Summon Watch";
    this.description = "Whenever you summon a minion with low attack, this minion gains a buff";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  
    this.maxAttackTrigger = 0;
  }

  static createContextObject(attackBuff, maxHPBuff, maxAttackTrigger, appliedModifierName=null, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (maxAttackTrigger == null) { maxAttackTrigger = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff, {
        modifierName:this.modifierName,
        description:Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff),
        appliedName:appliedModifierName
      })
    ];
    contextObject.maxAttackTrigger = maxAttackTrigger;
    return contextObject;
  }

  onSummonWatch(action) {

    const entity = action.getTarget();
    if (entity != null) {
      if (entity.getBaseATK() <= this.maxAttackTrigger) {
        return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
      }
    }
  }
}
ModifierSummonWatchIfLowAttackSummonedBuffSelf.initClass();

module.exports = ModifierSummonWatchIfLowAttackSummonedBuffSelf;
