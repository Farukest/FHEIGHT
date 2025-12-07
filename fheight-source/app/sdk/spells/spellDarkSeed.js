/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellDamage = require('./spellDamage');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');

class SpellDarkSeed extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    // deal 1 damage for each card in opponent's hand
    const opponent = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());
    const cardsInHand = opponent.getDeck().getNumCardsInHand();
    this.damageAmount = cardsInHand;
    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (general != null) { applyEffectPositions.push(general.getPosition()); }

    return applyEffectPositions;
  }
}


module.exports = SpellDarkSeed;
