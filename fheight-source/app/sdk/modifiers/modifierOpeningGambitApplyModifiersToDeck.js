/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
 Modifier is used to apply modifiers to cards in deck and hand when a card is played to the board.
*/
class ModifierOpeningGambitApplyModifiersToDeck extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitApplyModifiersToDeck";
    this.type ="ModifierOpeningGambitApplyModifiersToDeck";
  
    this.description = "";
  
    this.prototype.modifiersContextObjects = null; // modifier context objects for modifiers to apply
    this.prototype.managedByCard = false; // whether card with opening gambit should manage the modifiers applied, i.e. when the card is silenced/killed these modifiers are removed
    this.prototype.applyToOwnPlayer = false;
    this.prototype.applyToEnemyPlayer = false;
    this.prototype.cardType = CardType.Unit; // type of card to target
    this.prototype.raceId = null; // race of cards to target
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, managedByCard, applyToOwnPlayer, applyToEnemyPlayer, cardType, raceId=null, description, options) {
    if (managedByCard == null) { managedByCard = false; }
    if (applyToOwnPlayer == null) { applyToOwnPlayer = false; }
    if (applyToEnemyPlayer == null) { applyToEnemyPlayer = false; }
    if (cardType == null) { cardType = CardType.Unit; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.managedByCard = managedByCard;
    contextObject.applyToOwnPlayer = applyToOwnPlayer;
    contextObject.applyToEnemyPlayer = applyToEnemyPlayer;
    contextObject.cardType = cardType;
    contextObject.raceId = raceId;
    contextObject.description = description;
    return contextObject;
  }

  static createContextObjectToTargetOwnPlayer(modifiersContextObjects, managedByCard, cardType, raceId, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, true, false, cardType, raceId, description, options);
  }

  static createContextObjectToTargetEnemyPlayer(modifiersContextObjects, managedByCard, cardType, raceId, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, true, cardType, raceId, description, options);
  }

  onOpeningGambit() {
    if (this.modifiersContextObjects != null) {
      return Array.from(this.getCardsAffected()).map((card) =>
        Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.managedByCard ?
            this.getGameSession().applyModifierContextObject(modifierContextObject, card, this)
          :
            this.getGameSession().applyModifierContextObject(modifierContextObject, card)));
    }
  }

  getCardsAffected() {
    let deck;
    const {
      cardType
    } = this;
    const {
      raceId
    } = this;
    let cards = [];

    if (this.applyToOwnPlayer) {
      deck = this.getCard().getOwner().getDeck();
      cards = cards.concat(deck.getCardsInHand(), deck.getCardsInDrawPile());
    }

    if (this.applyToEnemyPlayer) {
      deck = this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId()).getDeck();
      cards = cards.concat(deck.getCardsInHand(), deck.getCardsInDrawPile());
    }

    return _.filter(cards, card => (card != null) && (!cardType || (card.getType() === cardType)) && (!raceId || card.getBelongsToTribe(raceId)));
  }
}
ModifierOpeningGambitApplyModifiersToDeck.initClass();

module.exports = ModifierOpeningGambitApplyModifiersToDeck;
