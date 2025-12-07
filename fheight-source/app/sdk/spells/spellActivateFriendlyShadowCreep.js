/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const ModifierStackingShadows = require('app/sdk/modifiers/modifierStackingShadows');

class SpellActivateFriendlyShadowCreep extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const creepTile = this.getGameSession().getBoard().getTileAtPosition({x, y}, true, false);
    if ((creepTile != null) && (creepTile.getBaseCardId() === Cards.Tile.Shadow)) {
      const modifiers = creepTile.getModifiers();
      if (modifiers != null) {
        return (() => {
          const result = [];
          for (var modifier of Array.from(modifiers)) {
            if (modifier instanceof ModifierStackingShadows) {
              modifier.activateShadowCreep();
              break;
            } else {
              result.push(undefined);
            }
          }
          return result;
        })();
      }
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    const board = this.getGameSession().getBoard();
    const friendlyCreepPositions = [];
    for (var tile of Array.from(board.getTiles(true, false))) {
      if ((tile != null) && (tile.getOwnerId() === this.getOwnerId()) && (tile.getBaseCardId() === Cards.Tile.Shadow)) {
        friendlyCreepPositions.push({x:tile.getPosition().x, y:tile.getPosition().y});
      }
    }
    return friendlyCreepPositions;
  }
}

module.exports = SpellActivateFriendlyShadowCreep;
