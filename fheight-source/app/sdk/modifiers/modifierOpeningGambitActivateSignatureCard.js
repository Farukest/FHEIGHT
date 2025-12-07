/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');

class ModifierOpeningGambitActivateSignatureCard extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitActivateSignatureCard";
    this.type = "ModifierOpeningGambitActivateSignatureCard";
  
    this.modifierName = "Opening Gambit";
    this.description = "Refresh your General's Bloodbound Spell";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    const player = this.getCard().getGameSession().getPlayerById(this.getCard().getOwnerId());
    return this.getGameSession().executeAction(player.actionGenerateSignatureCard());
  }
}
ModifierOpeningGambitActivateSignatureCard.initClass();

module.exports = ModifierOpeningGambitActivateSignatureCard;
