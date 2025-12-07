/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentDrawCardWatch = require('./modifierOpponentDrawCardWatch');
const Modifier = require('./modifier');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierOpponentDrawCardWatchBuffSelf extends ModifierOpponentDrawCardWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentDrawCardWatchBuffSelf";
    this.type ="ModifierOpponentDrawCardWatchBuffSelf";
  
    this.modifierName ="ModifierOpponentDrawCardWatchBuffSelf";
    this.description = "Whenever your opponent draws a card, this minion gains %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentDrawCardWatchBuffSelf", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
        modifierName:this.modifierName,
        appliedName:"Vindicated!",
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

  onDrawCardWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierOpponentDrawCardWatchBuffSelf.initClass();

module.exports = ModifierOpponentDrawCardWatchBuffSelf;
