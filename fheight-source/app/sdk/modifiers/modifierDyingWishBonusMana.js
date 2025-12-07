/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const ModifierDyingWish =   require('./modifierDyingWish');
const BonusManaAction =   require('app/sdk/actions/bonusManaAction');

class ModifierDyingWishBonusMana extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishBonusMana";
    this.type ="ModifierDyingWishBonusMana";
  
    this.modifierName = "Bonus Mana";
    this.description = "When this entity dies, its owner gains bonus mana";
  
    this.prototype.bonusMana = 1;
    this.prototype.bonusDuration = 1;
  }

  onDyingWish() {
    super.onDyingWish();

    // it is possible that this entity will be owned by the game session
    // but lets try to target the player's general
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const action = this.getGameSession().createActionForType(BonusManaAction.type);
      action.setTarget(general);
      action.bonusMana = this.bonusMana;
      action.bonusDuration = this.bonusDuration;
      return this.getGameSession().executeAction(action);
    }
  }
}
ModifierDyingWishBonusMana.initClass();

module.exports = ModifierDyingWishBonusMana;
