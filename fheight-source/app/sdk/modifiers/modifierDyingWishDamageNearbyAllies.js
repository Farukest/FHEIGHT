/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierDyingWish = require('./modifierDyingWish');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDyingWishDamageNearbyAllies extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDamageNearbyAllies";
    this.type ="ModifierDyingWishDamageNearbyAllies";
  
    this.modifierName ="Curse of Agony";
    this.keyworded = false;
    this.description = "When this minion dies, deal %X damage to all nearby friendly minions and General";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWishDamageNearbyAllies", "FX.Modifiers.ModifierGenericDamageNearbyShadow"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onDyingWish() {
    const validEntities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);

    return (() => {
      const result = [];
      for (var entity of Array.from(validEntities)) {
        var damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.damageAmount);
        result.push(this.getGameSession().executeAction(damageAction));
      }
      return result;
    })();
  }
}
ModifierDyingWishDamageNearbyAllies.initClass();

module.exports = ModifierDyingWishDamageNearbyAllies;
