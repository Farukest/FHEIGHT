/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierStartsInHand extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierStartsInHand";
    this.type = "ModifierStartsInHand";
  
    this.modifierName ="";
    this.description ="";
  }
}
ModifierStartsInHand.initClass();

module.exports = ModifierStartsInHand;
