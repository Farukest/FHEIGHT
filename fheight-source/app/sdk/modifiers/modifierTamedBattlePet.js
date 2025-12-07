/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierTamedBattlePet extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierTamedBattlePet";
    this.type ="ModifierTamedBattlePet";
  
    this.modifierName = "Tamed Battle Pet";
    this.description = "Listens to owner's commands";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTamedBattlePet"];
  }
}
ModifierTamedBattlePet.initClass();

module.exports = ModifierTamedBattlePet;
