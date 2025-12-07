/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStackingShadowsBonusDamage = require('./modifierStackingShadowsBonusDamage');

class ModifierStackingShadowsBonusDamageUnique extends ModifierStackingShadowsBonusDamage {
  static initClass() {
  
    this.prototype.type = "ModifierStackingShadowsBonusDamageUnique";
    this.type = "ModifierStackingShadowsBonusDamageUnique";
  
    this.prototype.maxStacks = 1;
  }
}
ModifierStackingShadowsBonusDamageUnique.initClass();

module.exports = ModifierStackingShadowsBonusDamageUnique;
