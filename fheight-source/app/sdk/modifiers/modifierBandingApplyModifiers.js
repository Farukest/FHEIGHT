/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =       require('app/common/config');
const ModifierBanding =   require('./modifierBanding');
const ModifierBandedHeal =     require('./modifierBandedHeal');

class ModifierBandingApplyModifiers extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingApplyModifiers";
    this.type ="ModifierBandingApplyModifiers";
  
    this.prototype.maxStacks = 1;
  
    this.description = "Apply buffs";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal"];
  }

  static createContextObject(modifiersContextObjects, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.description = description;
    return contextObject;
  }
}
ModifierBandingApplyModifiers.initClass();

module.exports = ModifierBandingApplyModifiers;
