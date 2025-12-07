/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const Spell = require('./spell');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');

class SpellTickleTendril extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const entity = board.getUnitAtPosition(position);

    if (entity != null) {
      let maxDamageAmount = 0;
      for (var card of Array.from(this.getGameSession().getBoard().getCards(CardType.Tile, true))) {
        if ((card.getBaseCardId() === Cards.Tile.Shadow) && card.isOwnedBy(this.getOwner())) {
          maxDamageAmount++; //increase damage of spell
        }
      }

      if (maxDamageAmount > 0) {
        let finalDamageAmount = 0;
        if (maxDamageAmount < entity.getHP()) {
          finalDamageAmount = maxDamageAmount;
        } else {
          finalDamageAmount = entity.getHP();
        }

        // heal my general
        const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getOwnerId());
        healAction.setTarget(myGeneral);
        healAction.setHealAmount(finalDamageAmount);
        this.getGameSession().executeAction(healAction);

        // damage enemy minion
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getOwnerId());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(finalDamageAmount);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }
}

module.exports = SpellTickleTendril;
