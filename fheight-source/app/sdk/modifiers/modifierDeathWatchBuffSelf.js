/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDeathWatch = require('./modifierDeathWatch');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

const i18next = require('i18next');

class ModifierDeathWatchBuffSelf extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchBuffSelf";
    this.type ="ModifierDeathWatchBuffSelf";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.deathwatch_def");
  
    this.modifierName =i18next.t("modifiers.deathwatch_name");
    this.description = "Gains %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
        modifierName:this.modifierName,
        appliedName:i18next.t("modifiers.deathwatch_buff_applied_name"),
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

  onDeathWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierDeathWatchBuffSelf.initClass();

module.exports = ModifierDeathWatchBuffSelf;
