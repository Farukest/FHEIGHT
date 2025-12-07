/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');

class ModifierOpeningGambitDrawRandomBattlePet extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDrawRandomBattlePet";
    this.type = "ModifierOpeningGambitDrawRandomBattlePet";
  
    this.modifierName = "Opening Gambit";
    this.description = "Put a random Battle Pet into your action bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
      const card = neutralBattlePetCards[this.getGameSession().getRandomIntegerForExecution(neutralBattlePetCards.length)];
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), card.createNewCardData() );
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierOpeningGambitDrawRandomBattlePet.initClass();

module.exports = ModifierOpeningGambitDrawRandomBattlePet;
