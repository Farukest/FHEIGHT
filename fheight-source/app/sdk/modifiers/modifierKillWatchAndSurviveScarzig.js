/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatchAndSurvive = require('./modifierKillWatchAndSurvive');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');
const RemoveCardFromHandAction = require('app/sdk/actions/removeCardFromHandAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');

class ModifierKillWatchAndSurviveScarzig extends ModifierKillWatchAndSurvive {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchAndSurviveScarzig";
    this.type ="ModifierKillWatchAndSurviveScarzig";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(false, true, options);
    return contextObject;
  }

  onKillWatchAndSurvive(action) {
    super.onKillWatchAndSurvive(action);

    const deck = this.getCard().getOwner().getDeck();
    const iterable = deck.getCardsInHand();
    for (let i = 0; i < iterable.length; i++) {
      var cardInHand = iterable[i];
      if ((cardInHand != null) && (cardInHand.getBaseCardId() === Cards.Neutral.Scarzig)) {
        var removeCardFromHandAction = new RemoveCardFromHandAction(this.getGameSession(), i, this.getOwnerId());
        this.getGameSession().executeAction(removeCardFromHandAction);

        var putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), {id: Cards.Neutral.BigScarzig});
        this.getGameSession().executeAction(putCardInHandAction);
      }
    }

    for (var cardInDeck of Array.from(deck.getCardsInDrawPile())) {
      if ((cardInDeck != null) && (cardInDeck.getBaseCardId() === Cards.Neutral.Scarzig)) {
        var removeCardFromDeckAction = new RemoveCardFromDeckAction(this.getGameSession(), cardInDeck.getIndex(), this.getOwnerId());
        this.getGameSession().executeAction(removeCardFromDeckAction);

        var putCardInDeckAction = new PutCardInDeckAction(this.getGameSession(), this.getOwnerId(), {id: Cards.Neutral.BigScarzig});
        this.getGameSession().executeAction(putCardInDeckAction);
      }
    }

    return (() => {
      const result = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if ((unit != null) && unit.getIsSameTeamAs(this.getCard()) && !unit.getIsGeneral() && this.getGameSession().getCanCardBeScheduledForRemoval(unit) && (unit.getBaseCardId() === Cards.Neutral.Scarzig)) {

          var removeOriginalEntityAction = new RemoveAction(this.getGameSession());
          removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
          removeOriginalEntityAction.setTarget(unit);
          this.getGameSession().executeAction(removeOriginalEntityAction);

          var cardData = {id: Cards.Neutral.BigScarzig};
          if (cardData.additionalInherentModifiersContextObjects == null) { cardData.additionalInherentModifiersContextObjects = []; }
          cardData.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(unit.getExhausted(), unit.getMovesMade(), unit.getAttacksMade()));
          var spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), this.getCard().getOwnerId(), unit.getPosition().x, unit.getPosition().y, cardData);
          result.push(this.getGameSession().executeAction(spawnEntityAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierKillWatchAndSurviveScarzig.initClass();

module.exports = ModifierKillWatchAndSurviveScarzig;
