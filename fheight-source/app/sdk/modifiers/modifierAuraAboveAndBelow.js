/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierAuraAboveAndBelow extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierAuraAboveAndBelow";
    this.type = "ModifierAuraAboveAndBelow";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAuraAboveAndBelow"];
  }

  _findPotentialCardsInAura() {
    const finalFilteredCards = [];
    const potentialCards = super._findPotentialCardsInAura();

    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const generalPosition = general.getPosition();

    for (var card of Array.from(potentialCards)) {
      var entityPosition = card.getPosition();
      if ((Math.abs(entityPosition.x - generalPosition.x) === 0) && (Math.abs(entityPosition.y - generalPosition.y) <= 1)) {
        finalFilteredCards.push(card);
      }
    }
    return finalFilteredCards;
  }
}
ModifierAuraAboveAndBelow.initClass();

module.exports = ModifierAuraAboveAndBelow;
