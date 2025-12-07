/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierHealWatch = require('./modifierHealWatch');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

const i18next = require('i18next');

class ModifierHealWatchBuffSelf extends ModifierHealWatch {
  static initClass() {
  
    this.prototype.type ="ModifierHealWatchBuffSelf";
    this.type ="ModifierHealWatchBuffSelf";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierHealWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statsBuff.appliedName = i18next.t("modifiers.healwatch_bufself_applied_name");
    contextObject.modifiersContextObjects = [statsBuff];
    return contextObject;
  }

  onHealWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierHealWatchBuffSelf.initClass();

module.exports = ModifierHealWatchBuffSelf;
