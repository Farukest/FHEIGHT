/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =       require('app/common/config');
const ModifierBanding =   require('./modifierBanding');
const ModifierBandedHeal =     require('./modifierBandedHeal');
const i18next = require('i18next');

class ModifierBandingHeal extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingHeal";
    this.type ="ModifierBandingHeal";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealHeal"];
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = i18next.t("modifiers.banding_heal_applied_name");
    const bandedContextObject = ModifierBandedHeal.createContextObject();
    bandedContextObject.appliedName = i18next.t("modifiers.banded_heal_applied_name");
    contextObject.modifiersContextObjects = [bandedContextObject];
    return contextObject;
  }
}
ModifierBandingHeal.initClass();


module.exports = ModifierBandingHeal;
