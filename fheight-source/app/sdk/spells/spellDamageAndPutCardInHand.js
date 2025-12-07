/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage = require('./spellDamage');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const _ = require('underscore');

class SpellDamageAndPutCardInHand extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    const applyEffectPosition = {x, y};

    const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), this.cardDataOrIndexToPutInHand);
    this.getGameSession().executeAction(a);

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }
}

module.exports = SpellDamageAndPutCardInHand;
