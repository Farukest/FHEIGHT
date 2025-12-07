/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSpellWatch = require('./modifierSpellWatch');

class ModifierSpellWatchApplyModifiers extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchApplyModifiers";
    this.type ="ModifierSpellWatchApplyModifiers";
  
    this.modifierName ="Spell Watch";
    this.description = "Whenever you cast a spell, apply a modifier to this minion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiers, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiers;
    return contextObject;
  }

  onSpellWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierSpellWatchApplyModifiers.initClass();

module.exports = ModifierSpellWatchApplyModifiers;
