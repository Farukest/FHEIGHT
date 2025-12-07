/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiersToUnitsInHand = require('./spellApplyModifiersToUnitsInHand');
const ModifierBackstab = require('app/sdk/modifiers/modifierBackstab');

class SpellShadowWaltz extends SpellApplyModifiersToUnitsInHand {

  getCardsAffected() {
    const potentialCards = super.getCardsAffected();
    const finalCards = [];
    for (var card of Array.from(potentialCards)) {
      if ((card != null) && card.hasModifierType(ModifierBackstab.type)) {
        finalCards.push(card);
      }
    }

    return finalCards;
  }
}

module.exports = SpellShadowWaltz;
