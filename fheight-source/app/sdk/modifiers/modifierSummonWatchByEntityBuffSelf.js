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

class ModifierSummonWatchByEntityBuffSelf extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchByEntityBuffSelf";
    this.type ="ModifierSummonWatchByEntityBuffSelf";
  
    this.modifierName ="Summon Watch (buff by entity)";
    this.description = "Whenever you summon a %X, this gains %Y";
  
    this.prototype.cardName = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff, targetEntityId, cardName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    this.targetEntityId = targetEntityId;
    const contextObject = super.createContextObject(options);
    contextObject.targetEntityId = this.targetEntityId;
    contextObject.cardName = cardName;
    const statBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statBuff.appliedName = "Overseer\'s Growth";
    contextObject.modifiersContextObjects = [statBuff];

    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      const replaceText = this.description.replace(/%Y/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
      return replaceText.replace(/%X/, modifierContextObject.cardName);
    } else {
      return this.description;
    }
  }

  onSummonWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }

  getIsCardRelevantToWatcher(card) {
    return card.getBaseCardId() === this.targetEntityId;
  }
}
ModifierSummonWatchByEntityBuffSelf.initClass();


module.exports = ModifierSummonWatchByEntityBuffSelf;
