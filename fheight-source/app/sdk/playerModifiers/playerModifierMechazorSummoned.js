/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');

class PlayerModifierMechazorSummoned extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierMechazorSummoned";
    this.type ="PlayerModifierMechazorSummoned";
  
    this.modifierName ="MECHAZ0R Built";
    this.description = "MECHAZ0R";
  
    this.prototype.isRemovable = false;
  }
}
PlayerModifierMechazorSummoned.initClass();

module.exports = PlayerModifierMechazorSummoned;
