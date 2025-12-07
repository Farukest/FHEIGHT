/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierInfiltrate = require('app/sdk/modifiers/modifierInfiltrate');

class ModifierAlwaysInfiltrated extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAlwaysInfiltrated";
    this.type ="ModifierAlwaysInfiltrated";
  
    this.isHiddenToUI = true;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAlwaysInfiltrated"];
  }
}
ModifierAlwaysInfiltrated.initClass();

module.exports = ModifierAlwaysInfiltrated;
