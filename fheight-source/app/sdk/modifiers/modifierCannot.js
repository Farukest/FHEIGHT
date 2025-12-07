/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

/*
  Abstract modifier that should be the superclass for any modifiers that prevent a unit from doing something.
*/
class ModifierCannot extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierCannot";
    this.type = "ModifierCannot";
  
    this.modifierName = "Cannot";
    this.description = "";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCannot"];
  }
}
ModifierCannot.initClass();

module.exports = ModifierCannot;
