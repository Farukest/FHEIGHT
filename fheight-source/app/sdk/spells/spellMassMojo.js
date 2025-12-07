/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierGrow = require('app/sdk/modifiers/modifierGrow');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');

class SpellMassMojo extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    board = this.getGameSession().getBoard();

    for (var tile of Array.from(board.getTiles(true, false))) {
      if (((tile != null ? tile.getOwnerId() : undefined) === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.PrimalMojo)) {
        var tilePosition = {x:tile.getPosition().x, y:tile.getPosition().y};
        var unitOnTile = board.getCardAtPosition(tilePosition, CardType.Unit);
        // find friendly minions standing on primal flourish tiles who can Grow
        if ((unitOnTile != null) && (unitOnTile.getOwnerId() === this.getOwnerId()) && !unitOnTile.getIsGeneral() && unitOnTile.hasActiveModifierClass(ModifierGrow)) {
          for (var mod of Array.from(unitOnTile.getActiveModifiersByClass(ModifierGrow))) {
            mod.activateGrow();
          } // activate each instance of Grow on the minion
        }
      }
    }

    return (() => {
      const result = [];
      for (var unit of Array.from(board.getUnits(true, false))) {
        if (((unit != null ? unit.getOwnerId() : undefined) === this.getOwnerId()) && !unit.getIsGeneral()) {
          var position = unit.getPosition();
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), position.x, position.y, {id: Cards.Tile.PrimalMojo});
          playCardAction.setSource(this);
          result.push(this.getGameSession().executeAction(playCardAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

module.exports = SpellMassMojo;
