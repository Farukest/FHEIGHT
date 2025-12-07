/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBanding =         require('./modifierBanding');
const ModifierBanded =       require('./modifierBanded');
const Stringifiers =         require('app/sdk/helpers/stringifiers');
const i18next = require('i18next');

class ModifierBandingAttack extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingAttack";
    this.type ="ModifierBandingAttack";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealAttack"];
  }

  static createContextObject(attackBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = i18next.t("modifiers.banding_attack_applied_name");
    const attackBuffContextObject = ModifierBanded.createContextObject(attackBuff);
    attackBuffContextObject.appliedName = i18next.t("modifiers.banded_attack_applied_name");
    contextObject.modifiersContextObjects = [attackBuffContextObject];
    return contextObject;
  }
}
ModifierBandingAttack.initClass();

module.exports = ModifierBandingAttack;
