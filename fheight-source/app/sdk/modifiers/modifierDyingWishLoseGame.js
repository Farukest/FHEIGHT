/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const KillAction = require('app/sdk/actions/killAction');

class ModifierDyingWishLoseGame extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishLoseGame";
    this.type ="ModifierDyingWishLoseGame";
  
    this.prototype.name ="Dying Wish: Kill General";
    this.prototype.description = "When this minion dies, your general dies";
  
    this.appliedName = "Life Link";
    this.appliedDescription = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericDamage"];
  }

  onDyingWish() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(general);
      return this.getGameSession().executeAction(killAction);
    }
  }
}
ModifierDyingWishLoseGame.initClass();

module.exports = ModifierDyingWishLoseGame;
