/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStunned = require('./modifierStunned');

class ModifierStun extends ModifierStunned {
  static initClass() {
  
    this.prototype.type ="ModifierStun";
    this.type ="ModifierStun";
    this.modifierName = "Stun";
  }
}
ModifierStun.initClass();

module.exports = ModifierStun;
