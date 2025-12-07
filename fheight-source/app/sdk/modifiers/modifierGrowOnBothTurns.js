/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierGrowOnBothTurns extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierGrowOnBothTurns";
    this.type ="ModifierGrowOnBothTurns";
  
    this.modifierName =i18next.t("modifiers.grow_on_both_turns_name");
    this.description =i18next.t("modifiers.grow_on_both_turns_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGrowOnBothTurns"];
  }
}
ModifierGrowOnBothTurns.initClass();

module.exports = ModifierGrowOnBothTurns;
