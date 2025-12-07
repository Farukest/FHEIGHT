/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const RemoveCardFromHandAction = require('app/sdk/actions/removeCardFromHandAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierCannotBeRemovedFromHand = require('app/sdk/modifiers/modifierCannotBeRemovedFromHand');

class SpellKoanOfHorns extends Spell {
  static initClass() {
  
    this.prototype.cardDataOrIndex = {id: Cards.Faction2.GoreHorn};
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    let card;
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);
    const cardData = this.cardDataOrIndex;
    cardData.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-3)];
    // we're going to replace all UNITS in deck and hand with Gore Horns
    // first check all cards in player's hand
    const iterable = this.getOwner().getDeck().getCardsInHand();
    for (let i = 0; i < iterable.length; i++) {
      card = iterable[i];
      if ((card != null) && (card.getType() === CardType.Unit) && !card.hasActiveModifierClass(ModifierCannotBeRemovedFromHand)) {
        var removeCardFromHandAction = new RemoveCardFromHandAction(this.getGameSession(), i, this.getOwnerId());
        this.getGameSession().executeAction(removeCardFromHandAction);
        var putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), cardData);
        this.getGameSession().executeAction(putCardInHandAction);
      }
    }

    // next check all cards in player's deck
    return (() => {
      const result = [];
      for (card of Array.from(this.getOwner().getDeck().getCardsInDrawPile())) {
        if ((card != null) && (card.getType() === CardType.Unit)) {
          var removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), card.getIndex(), this.getOwnerId());
          this.getGameSession().executeAction(removeCardFromDeckAction);
          var putCardInDeckAction = new PutCardInDeckAction(this.getGameSession(), this.getOwnerId(), cardData);
          result.push(this.getGameSession().executeAction(putCardInDeckAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
SpellKoanOfHorns.initClass();

module.exports = SpellKoanOfHorns;
