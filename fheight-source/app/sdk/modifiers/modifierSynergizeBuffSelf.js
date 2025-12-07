/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');

class ModifierSynergizeBuffSelf extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeBuffSelf";
    this.type ="ModifierSynergizeBuffSelf";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize"];
  
    this.prototype.modifiers = null;
  }

  static createContextObject(modifiers, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiers = modifiers;
    return contextObject;
  }

  onSynergize(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiers, this.getCard());
  }
}
ModifierSynergizeBuffSelf.initClass();

module.exports = ModifierSynergizeBuffSelf;
