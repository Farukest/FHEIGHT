/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellUpperHand extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const minion = board.getCardAtPosition(applyEffectPosition, CardType.Unit, false, false);
    const hand = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId()).getDeck().getCardsInHandExcludingMissing();
    if ((hand != null) && (minion != null) && (hand.length > 0)) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getOwnerId());
      damageAction.setSource(this);
      damageAction.setTarget(minion);
      damageAction.setDamageAmount(hand.length);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}

module.exports = SpellUpperHand;
