/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellDuplicator extends Spell {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {

    const applyEffectPosition = {x, y};
    const entityToClone = board.getUnitAtPosition(applyEffectPosition);
    const ownerId = this.getOwnerId();

    if (entityToClone != null) {
      // put fresh copy of spell into deck
      const a = new PutCardInDeckAction(this.getGameSession(), ownerId, entityToClone.createNewCardData());
      this.getGameSession().executeAction(a);
      const b = new PutCardInDeckAction(this.getGameSession(), ownerId, entityToClone.createNewCardData());
      this.getGameSession().executeAction(b);
      const c = new PutCardInDeckAction(this.getGameSession(), ownerId, entityToClone.createNewCardData());
      return this.getGameSession().executeAction(c);
    }
  }
}

module.exports = SpellDuplicator;
