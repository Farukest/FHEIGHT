/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Races = require('app/sdk/cards/racesLookup.js');

class ModifierDyingWishDrawMechazorCard extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type = "ModifierDyingWishDrawMechazorCard";
    this.type = "ModifierDyingWishDrawMechazorCard";
  
    this.description = "Put a random MECH minion into your action bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onDyingWish() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const mechCards = this.getGameSession().getCardCaches().getRace(Races.Mech).getIsPrismatic(false).getIsSkinned(false).getCards();
      const mechCard = mechCards[this.getGameSession().getRandomIntegerForExecution(mechCards.length)];
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), mechCard.createNewCardData() );
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierDyingWishDrawMechazorCard.initClass();

module.exports = ModifierDyingWishDrawMechazorCard;
