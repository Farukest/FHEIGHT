/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierObstructing extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierObstructing";
    this.type = "ModifierObstructing";
  
    this.modifierName = "Obstructing";
    this.description = "This entity is obstructing its location";
  
    this.prototype.maxStacks = 1;
  }
}
ModifierObstructing.initClass();

module.exports = ModifierObstructing;
