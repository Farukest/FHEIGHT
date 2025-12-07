/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierDyingWishDamageGeneral extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDamageGeneral";
    this.type ="ModifierDyingWishDamageGeneral";
  
    this.prototype.name ="Dying Wish: Damage General";
    this.prototype.description = "When this minion dies, deal damage to its general";
  
    this.appliedName = "Agonizing Death";
    this.appliedDescription = "";
  
    this.prototype.damageAmount = null; //if you want to deal a specific amount of damage, set it here, defaults to attack value of entity this modifier is attached to
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericDamage"];
  }

  static getAppliedDescription(contextObject) {
    if (this.damageAmount) {
      return "When this minion dies, deal " + damageAmount + " damage to its general";
    } else {
      return "When this minion dies, deal its attack in damage to its general";
    }
  }

  onDyingWish() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setTarget(general);
      if (!this.damageAmount) {
        damageAction.setDamageAmount(this.getCard().getATK());
      } else {
        damageAction.setDamageAmount(this.damageAmount);
      }
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierDyingWishDamageGeneral.initClass();

module.exports = ModifierDyingWishDamageGeneral;
