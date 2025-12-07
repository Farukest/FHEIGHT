/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const ModifierManaCostChange = require('./modifierManaCostChange');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup.js');

class ModifierDyingWishXho extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type = "ModifierDyingWishXho";
    this.type = "ModifierDyingWishXho";
  
    this.modifierName = "Dying Wish";
    this.description = "Put a random Songhai spell into your action bar. It costs 1 less";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onDyingWish() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const f2SpellCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction2).getType(CardType.Spell).getIsHiddenInCollection(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      const spellCard = f2SpellCards[this.getGameSession().getRandomIntegerForExecution(f2SpellCards.length)];
      const cardData = spellCard.createNewCardData();
      cardData.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-1)];
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardData);
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierDyingWishXho.initClass();

module.exports = ModifierDyingWishXho;
