/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanding = require('./modifierBanding');
const ModifierBandedFlying = require('./modifierBandedFlying');

class ModifierBandingFlying extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingFlying";
    this.type ="ModifierBandingFlying";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierFlying"];
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [ModifierBandedFlying.createContextObject()];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }
}
ModifierBandingFlying.initClass();

module.exports = ModifierBandingFlying;
