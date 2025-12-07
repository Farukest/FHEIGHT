/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

/*
  Abstract modifier superclass for all modifiers that add some type of immunity.
*/

class ModifierImmune extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierImmune";
    this.type = "ModifierImmune";
  
    this.modifierName = "Immune";
    this.description = "";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierImmunity"];
  }
}
ModifierImmune.initClass();

module.exports = ModifierImmune;
