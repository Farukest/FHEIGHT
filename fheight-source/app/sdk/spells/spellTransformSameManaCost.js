/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const RemoveAction = require('app/sdk/actions/removeAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const GameFormat = require('app/sdk/gameFormat');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');
const _ = require('underscore');

class SpellTransformSameManaCost extends Spell {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
     //random thing
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const targetUnit = board.getCardAtPosition({x, y}, this.targetType);
    const targetManaCost = targetUnit.getManaCost();
    const targetOwnerId = targetUnit.getOwnerId();
    const targetPosition = targetUnit.getPosition();

    if (targetUnit != null) {
      // find valid minions
      let card;
      let cardCache = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        cardCache = this.getGameSession().getCardCaches().getIsLegacy(false).getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit).getCards();
      } else {
        cardCache = this.getGameSession().getCardCaches().getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit).getCards();
      }
      let cards = [];
      for (card of Array.from(cardCache)) {
        if ((card.getManaCost() === targetManaCost) && (card.getBaseCardId() !== targetUnit.getBaseCardId())) {
          cards.push(card);
        }
      }

      if ((cards != null ? cards.length : undefined) > 0) {
        // filter mythron cards
        cards = _.reject(cards, card => card.getRarityId() === 6);
      }

      if (cards.length > 0) {
        // remove original entity
        const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
        removeOriginalEntityAction.setOwnerId(this.getOwnerId());
        removeOriginalEntityAction.setTarget(targetUnit);
        this.getGameSession().executeAction(removeOriginalEntityAction);

        // pick randomly from among the units we found with right mana cost
        card = cards[this.getGameSession().getRandomIntegerForExecution(cards.length)];
        this.cardDataOrIndexToSpawn = card.createNewCardData();
        if (this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
        this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(targetUnit.getExhausted(), targetUnit.getMovesMade(), targetUnit.getAttacksMade()));

        const spawnEntityAction = new PlayCardAsTransformAction(this.getGameSession(), targetOwnerId, targetPosition.x, targetPosition.y, this.cardDataOrIndexToSpawn);
        return this.getGameSession().executeAction(spawnEntityAction);
      }
    }
  }
}
SpellTransformSameManaCost.initClass();

module.exports = SpellTransformSameManaCost;
