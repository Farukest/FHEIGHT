/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage = require('./spellDamage');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellLavaLance extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    this.damageAmount = 2; // regular damage of the spell
    for (var entity of Array.from(this.getGameSession().getBoard().getUnits())) { // check for any friendly eggs
      if (((entity != null ? entity.getOwnerId() : undefined) === this.getOwnerId()) && (entity.getBaseCardId() === Cards.Faction5.Egg)) {
        // found an egg owned by this player, so set new damage amount on the spell
        this.damageAmount = 4;
        break;
      }
    }
    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }
}

module.exports = SpellLavaLance;
