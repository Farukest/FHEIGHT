/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =       require('app/common/config');
const ModifierBanding =   require('./modifierBanding');
const ModifierBandedDoubleAttack =     require('./modifierBandedDoubleAttack');

class ModifierBandingDoubleAttack extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingDoubleAttack";
    this.type ="ModifierBandingDoubleAttack";
  
    this.prototype.maxStacks = 1;
  
    this.description = "Double this minion's Attack at the end of your turn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealDoubleAttack"];
  }

  static createContextObject(attackBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = "Zeal: Lion\'s Growth";
    const bandedContextObject = ModifierBandedDoubleAttack.createContextObject(attackBuff);
    bandedContextObject.appliedName = "Zealed: Lion\'s Growth";
    contextObject.modifiersContextObjects = [bandedContextObject];
    return contextObject;
  }
}
ModifierBandingDoubleAttack.initClass();

module.exports = ModifierBandingDoubleAttack;
