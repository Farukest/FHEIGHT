/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierDyingWishDrawWishCard extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type = "ModifierDyingWishDrawWishCard";
    this.type = "ModifierDyingWishDrawWishCard";
  
    this.description = "Put a random Wish card into your action bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onDyingWish() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const wishCards = [{id: Cards.Spell.ScionsFirstWish},{id: Cards.Spell.ScionsSecondWish}, {id: Cards.Spell.ScionsThirdWish}];
      const wishCard = wishCards[this.getGameSession().getRandomIntegerForExecution(wishCards.length)];
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), wishCard);
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierDyingWishDrawWishCard.initClass();

module.exports = ModifierDyingWishDrawWishCard;
