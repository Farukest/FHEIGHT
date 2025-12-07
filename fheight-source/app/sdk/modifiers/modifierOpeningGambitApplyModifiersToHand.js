/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierOpeningGambitApplyModifiersToDeckAndHand = require('./modifierOpeningGambitApplyModifiersToDeckAndHand');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
 Modifier is used to apply modifiers to cards ONLY IN HAND when a card is played to the board.
*/
class ModifierOpeningGambitApplyModifiersToHand extends ModifierOpeningGambitApplyModifiersToDeckAndHand {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitApplyModifiersToHand";
    this.type ="ModifierOpeningGambitApplyModifiersToHand";
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
      cards = cards.concat(deck.getCardsInHand());
    }

    if (this.applyToEnemyPlayer) {
      deck = this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId()).getDeck();
      cards = cards.concat(deck.getCardsInHand());
    }

    return _.filter(cards, card => (card != null) && (!cardType || (card.getType() === cardType)) && (!raceId || card.getBelongsToTribe(raceId)));
  }
}
ModifierOpeningGambitApplyModifiersToHand.initClass();

module.exports = ModifierOpeningGambitApplyModifiersToHand;
