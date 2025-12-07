/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');

class ModifierOpeningGambitDamageNearby extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageNearby";
    this.type = "ModifierOpeningGambitDamageNearby";
  
    this.modifierName = "Opening Gambit";
    this.description = "Deal %X damage to everything around it";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericDamageNearby"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject();
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

  onOpeningGambit() {
    const entities = this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
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
ModifierOpeningGambitDamageNearby.initClass();

module.exports = ModifierOpeningGambitDamageNearby;
