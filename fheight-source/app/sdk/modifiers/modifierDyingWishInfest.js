/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierDyingWishInfest extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishInfest";
    this.type ="ModifierDyingWishInfest";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierInfest", "FX.Modifiers.ModifierGenericChain"];
  }

  onDyingWish() {

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(general);
    damageAction.setDamageAmount(2);
    this.getGameSession().executeAction(damageAction);

    const nearbyAllies = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(nearbyAllies)) {
        if ((entity != null) && !entity.getIsGeneral()) {
          var deathPlagueModifier = ModifierDyingWishInfest.createContextObject();
          deathPlagueModifier.appliedName = "Death Plague";
          deathPlagueModifier.appliedDescription = "When this dies, deals 2 damage to your General, then spreads to nearby friendly minions.";
          result.push(this.getGameSession().applyModifierContextObject(deathPlagueModifier, entity));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierDyingWishInfest.initClass();

module.exports = ModifierDyingWishInfest;
