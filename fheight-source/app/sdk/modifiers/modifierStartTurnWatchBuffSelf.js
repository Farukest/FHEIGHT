/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierStartTurnWatchBuffSelf extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchBuffSelf";
    this.type ="ModifierStartTurnWatchBuffSelf";
  
    this.modifierName ="Start Turn Watch";
    this.description = "At the start of your turn, this minion gets %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    if ((attackBuff !== 0) || (maxHPBuff !== 0)) {
      contextObject.modifiersContextObjects = [
        Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
          modifierName:this.modifierName,
          description:Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff),
        })
      ];
      if (options && options.appliedName) {
        contextObject.modifiersContextObjects[0].appliedName = options.appliedName;
      }
    }
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

  onTurnWatch(action) {
    // override me in sub classes to implement special behavior
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierStartTurnWatchBuffSelf.initClass();

module.exports = ModifierStartTurnWatchBuffSelf;
