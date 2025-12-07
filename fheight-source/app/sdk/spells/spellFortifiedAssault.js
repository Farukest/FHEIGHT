/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('app/sdk/modifiers/modifier');
const SpellDamage = require('app/sdk/spells/spellDamage');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class SpellFortifiedAssault extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    let numTiles = 1;
    for (var tile of Array.from(board.getTiles(true, false))) {
      if (((tile != null ? tile.getOwnerId() : undefined) === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Hallowed)) {
        if (!((tile.getPosition().x === x) && (tile.getPosition().y === y))) {
          numTiles++;
        }
      }
    }

    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(0, numTiles);
    statContextObject.appliedName = "Fortification";
    this.setTargetModifiersContextObjects([
        statContextObject
    ]);

    this.damageAmount = numTiles;
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), x, y, {id: Cards.Tile.Hallowed});
    playCardAction.setSource(this);
    return this.getGameSession().executeAction(playCardAction);
  }
}

module.exports = SpellFortifiedAssault;
