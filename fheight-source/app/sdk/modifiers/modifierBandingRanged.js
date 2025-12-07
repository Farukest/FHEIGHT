/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =         require('app/common/config');
const ModifierBanding =   require('./modifierBanding');
const ModifierBandedRanged =     require('./modifierBandedRanged');

class ModifierBandingRanged extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingRanged";
    this.type ="ModifierBandingRanged";
  
    //@modifierName:"Zeal"
  
    //maxStacks: 1
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealRanged"];
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [ModifierBandedRanged.createContextObject()];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }
}
ModifierBandingRanged.initClass();

module.exports = ModifierBandingRanged;
