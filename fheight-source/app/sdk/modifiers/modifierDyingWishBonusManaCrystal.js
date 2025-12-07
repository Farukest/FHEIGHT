/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish =  require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const BonusManaCoreAction = require('app/sdk/actions/bonusManaCoreAction');

class ModifierDyingWishBonusManaCrystal extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishBonusManaCrystal";
    this.type ="ModifierDyingWishBonusManaCrystal";
  
    this.description ="Permanently gain 1 mana crystal";
  
    this.prototype.giveToOwner = true; // if false, will give mana to OPPONENT of dying entity
    this.prototype.amountToGain = 1;
  }

  static createContextObject(giveToOwner, amountToGain, options) {
    if (giveToOwner == null) { giveToOwner = true; }
    if (amountToGain == null) { amountToGain = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.giveToOwner = giveToOwner;
    contextObject.amountToGain = amountToGain;
    return contextObject;
  }

  onDyingWish() {
    super.onDyingWish();
    if (this.amountToGain > 0) {
      return (() => {
        const result = [];
        for (let i = 0; i < 1; i++) {
          var bonusManaCoreAction = new BonusManaCoreAction(this.getGameSession());
          bonusManaCoreAction.setSource(this.getCard());
          if (this.giveToOwner) {
            bonusManaCoreAction.setOwnerId(this.getCard().getOwnerId());
          } else {
            bonusManaCoreAction.setOwnerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));
          }
          result.push(this.getGameSession().executeAction(bonusManaCoreAction));
        }
        return result;
      })();
    }
  }
}
ModifierDyingWishBonusManaCrystal.initClass();

module.exports = ModifierDyingWishBonusManaCrystal;
