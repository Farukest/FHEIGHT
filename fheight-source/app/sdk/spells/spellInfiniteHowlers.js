/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookup');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellInfiniteHowlers extends SpellSpawnEntity {

  onApplyToBoard(board,x,y,sourceAction) {
    super.onApplyToBoard(board,x,y,sourceAction);

    const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), {id: Cards.Spell.InfiniteHowlers});
    return this.getGameSession().executeAction(a);
  }
}

module.exports = SpellInfiniteHowlers;
