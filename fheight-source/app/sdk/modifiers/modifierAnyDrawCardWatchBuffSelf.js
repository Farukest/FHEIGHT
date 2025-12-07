/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierAnyDrawCardWatch = require('./modifierAnyDrawCardWatch');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

const i18next = require('i18next');

class ModifierAnyDrawCardWatchBuffSelf extends ModifierAnyDrawCardWatch {
  static initClass() {
  
    this.prototype.type ="ModifierAnyDrawCardWatchBuffSelf";
    this.type ="ModifierAnyDrawCardWatchBuffSelf";
  
    this.modifierName =i18next.t("modifiers.any_draw_card_watch_buff_self_name");
    this.description =i18next.t("modifiers.any_draw_card_watch_buff_self_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDrawCardWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
        modifierName:this.modifierName,
        appliedName:i18next.t("modifiers.any_draw_card_watch_buff_self_applied"),
        description:Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff),
      })
    ];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      return i18next.t("modifiers.any_draw_card_watch_buff_self_def",{amount:Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP)});
      //return @description.replace /%X/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP)
    } else {
      return this.description;
    }
  }

  onDrawCardWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierAnyDrawCardWatchBuffSelf.initClass();

module.exports = ModifierAnyDrawCardWatchBuffSelf;
