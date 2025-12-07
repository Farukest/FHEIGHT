/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');
const _ = require('underscore');

class SpellApplyModifiersToUnitsInHand extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
    this.prototype.applyToOwnPlayer = false;
    this.prototype.applyToEnemyPlayer = false;
    this.prototype.cardTypeToTarget = CardType.Unit; // type of card to target
    this.prototype.raceIdToTarget = null;
     // race of cards to target
  }

  onApplyToBoard(board,x,y,sourceAction) {
    super.onApplyToBoard(board,x,y,sourceAction);

    return Array.from(this.getCardsAffected()).map((card) =>
      Array.from(this.targetModifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, card)));
  }

  getCardsAffected() {
    let deck;
    const cardType = this.cardTypeToTarget;
    const raceId = this.raceIdToTarget;
    let cards = [];

    if (this.applyToOwnPlayer) {
      deck = this.getOwner().getDeck();
      cards = deck.getCardsInHand();
    }

    if (this.applyToEnemyPlayer) {
      deck = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId()).getDeck();
      cards = deck.getCardsInHand();
    }

    return _.filter(cards, card => (card != null) && (!cardType || (card.getType() === cardType)) && (!raceId || card.getBelongsToTribe(raceId)));
  }
}
SpellApplyModifiersToUnitsInHand.initClass();

module.exports = SpellApplyModifiersToUnitsInHand;
