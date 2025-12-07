/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const RemoveManaCoreAction = require('app/sdk/actions/removeManaCoreAction');

class ModifierDyingWishDestroyManaCrystal extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type = "ModifierDyingWishDestroyManaCrystal";
    this.type = "ModifierDyingWishDestroyManaCrystal";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish"];
  
    this.prototype.amountToRemove = 1;
    this.prototype.takeFromOwner = false;
  }

  static createContextObject(takeFromOwner, amountToRemove, options) {
    if (takeFromOwner == null) { takeFromOwner = false; }
    if (amountToRemove == null) { amountToRemove = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.amountToRemove = amountToRemove;
    contextObject.takeFromOwner = takeFromOwner;
    return contextObject;
  }

  onDyingWish() {
    super.onDyingWish();

    const removeManaCoreAction = new RemoveManaCoreAction(this.getGameSession(), this.amountToRemove);
    removeManaCoreAction.setSource(this.getCard());
    if (this.takeFromOwner) {
      removeManaCoreAction.setOwnerId(this.getCard().getOwnerId());
    } else {
      removeManaCoreAction.setOwnerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));
    }
    return this.getGameSession().executeAction(this.getGameSession().executeAction(removeManaCoreAction));
  }
}
ModifierDyingWishDestroyManaCrystal.initClass();

module.exports = ModifierDyingWishDestroyManaCrystal;
