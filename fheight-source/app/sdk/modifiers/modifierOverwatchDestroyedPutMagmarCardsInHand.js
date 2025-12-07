/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let CardType = require('../cards/cardType');
const ModifierOverwatchDestroyed = require('./modifierOverwatchDestroyed');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup');
CardType = require('app/sdk/cards/cardType');

class ModifierOverwatchDestroyedPutMagmarCardsInHand extends ModifierOverwatchDestroyed {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchDestroyedPutMagmarCardsInHand";
    this.type ="ModifierOverwatchDestroyedPutMagmarCardsInHand";
  
    this.description = "When this minion is destroyed add two random Magmar spells with its mana cost to your action bar";
  }

  onOverwatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const factionCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction5).getIsHiddenInCollection(false).getIsToken(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Spell).getCards();
      const factionCardsWithThisManaCost = []; // now filter faction cards for cards with same mana cost as this minion
      for (var card of Array.from(factionCards)) {
        if (card.getManaCost() === this.getCard().getManaCost()) {
          factionCardsWithThisManaCost.push(card);
        }
      }

      if (factionCardsWithThisManaCost.length > 0) { // possible there are no faction cards with correct mana cost, so verify before putting cards in hand
        let cardToPutInHand = factionCardsWithThisManaCost[this.getGameSession().getRandomIntegerForExecution(factionCardsWithThisManaCost.length)];
        const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardToPutInHand.createNewCardData());

        cardToPutInHand = factionCardsWithThisManaCost[this.getGameSession().getRandomIntegerForExecution(factionCardsWithThisManaCost.length)];
        const a2 = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardToPutInHand.createNewCardData());

        this.getGameSession().executeAction(a);
        return this.getGameSession().executeAction(a2);
      }
    }
  }
}
ModifierOverwatchDestroyedPutMagmarCardsInHand.initClass();

module.exports = ModifierOverwatchDestroyedPutMagmarCardsInHand;
