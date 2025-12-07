/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');

class ModifierOpeningGambitRefreshSignatureCard extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitRefreshSignatureCard";
    this.type = "ModifierOpeningGambitRefreshSignatureCard";
  
    this.modifierName = "Opening Gambit";
    this.description = "Refresh your Bloodbound Spell";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    return this.getGameSession().executeAction(this.getOwner().actionActivateSignatureCard());
  }
}
ModifierOpeningGambitRefreshSignatureCard.initClass();

module.exports = ModifierOpeningGambitRefreshSignatureCard;
