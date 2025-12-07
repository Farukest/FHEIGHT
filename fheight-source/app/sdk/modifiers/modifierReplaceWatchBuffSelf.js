/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierReplaceWatch = require('./modifierReplaceWatch');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierReplaceWatchBuffSelf extends ModifierReplaceWatch {
  static initClass() {
  
    this.prototype.type ="ModifierReplaceWatchBuffSelf";
    this.type ="ModifierReplaceWatchBuffSelf";
  
    this.modifierName ="Replace Watch";
    this.description = "Whenever you replace a card, this minion gains %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierReplaceWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff, buffDescription, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (buffDescription == null) { buffDescription = undefined; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    if (buffDescription != null) {
      contextObject.buffDescription = buffDescription;
    }
    contextObject.modifiersContextObjects = [statsBuff];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject.buffDescription != null) {
      return this.description.replace(/%X/, modifierContextObject.buffDescription);
    } else {
      if (modifierContextObject) {
        const subContextObject = modifierContextObject.modifiersContextObjects[0];
        return this.description.replace(/%X/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
      } else {
        return this.description;
      }
    }
  }

  onReplaceWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierReplaceWatchBuffSelf.initClass();

module.exports = ModifierReplaceWatchBuffSelf;
