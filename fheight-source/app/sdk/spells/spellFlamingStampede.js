/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage = require('./spellDamage');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellFlamingStampede extends SpellDamage {

  _postFilterApplyPositions(originalPositions) {
    const filteredPositions = [];
    for (var position of Array.from(originalPositions)) {
      if (this.getGameSession().getBoard().getUnitAtPosition(position).getBaseCardId() !== Cards.Faction5.Egg) {
        filteredPositions.push(position);
      }
    }

    return filteredPositions;
  }
}

module.exports = SpellFlamingStampede;
