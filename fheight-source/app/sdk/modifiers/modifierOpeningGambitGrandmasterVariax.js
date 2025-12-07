/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambitChangeSignatureCard = require('./modifierOpeningGambitChangeSignatureCard');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpeningGambitGrandmasterVariax extends ModifierOpeningGambitChangeSignatureCard {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitGrandmasterVariax";
    this.type ="ModifierOpeningGambitGrandmasterVariax";
  
    this.modifierName ="Opening Gambit";
    this.description ="Your Bloodbound Spell costs 3 and is now AWESOME";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit(action) {
    // choose signature spell to replace based on General
    if (this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()).getBaseCardId() === Cards.Faction4.AltGeneral) {
      this.cardData = {id: Cards.Spell.SummonFiends};
    } else if (this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()).getBaseCardId() === Cards.Faction4.ThirdGeneral) {
      this.cardData = {id: Cards.Spell.SummonHusks};
    } else { //Lilithe's spell is more widely useful so make it default
      this.cardData = {id: Cards.Spell.FuriousLings};
    }
    return super.onOpeningGambit(action);
  }
}
ModifierOpeningGambitGrandmasterVariax.initClass();

module.exports = ModifierOpeningGambitGrandmasterVariax;
