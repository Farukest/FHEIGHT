/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Spell = require('./spell.js');
const ModifierPseudoRush =     require('app/sdk/modifiers/modifierPseudoRush');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');

class SpellMarchOfTheBrontos extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x,y};
    const unit = this.getGameSession().getBoard().getUnitAtPosition(position);
    if (((unit != null ? unit.getBaseCardId() : undefined) === Cards.Faction5.Egg) &&
    (unit.getOwnerId() === this.getOwnerId())) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getOwnerId());
      removeOriginalEntityAction.setTarget(unit);
      this.getGameSession().executeAction(removeOriginalEntityAction);

      const unitToSpawn = {id: Cards.Faction5.Megabrontodon};
      unitToSpawn.additionalInherentModifiersContextObjects = [ModifierPseudoRush.createContextObject()];
      const spawnEgg = new PlayCardAsTransformAction(this.getGameSession(), unit.getOwnerId(), position.x, position.y, unitToSpawn);
      return this.getGameSession().executeAction(spawnEgg);
    }
  }

  _postFilterApplyPositions(validPositions) {
    const filteredPositions = [];

    if (validPositions.length > 0) {
      // spell only applies to friendly eggs
      for (var position of Array.from(validPositions)) {
        if ((this.getGameSession().getBoard().getUnitAtPosition(position).getBaseCardId() === Cards.Faction5.Egg) &&
        (this.getGameSession().getBoard().getUnitAtPosition(position).getOwnerId() === this.getOwnerId())) {
          filteredPositions.push(position);
        }
      }
    }

    return filteredPositions;
  }
}

module.exports = SpellMarchOfTheBrontos;
