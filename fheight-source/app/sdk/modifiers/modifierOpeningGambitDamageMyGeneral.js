/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');
const CONFIG = require('app/common/config');


class ModifierOpeningGambitDamageMyGeneral extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageMyGeneral";
    this.type = "ModifierOpeningGambitDamageMyGeneral";
  
    this.modifierName = "Opening Gambit";
    this.description = "Deal %X damage to your General";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericChainLightning"];
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
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(general);
    damageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
ModifierOpeningGambitDamageMyGeneral.initClass();

module.exports = ModifierOpeningGambitDamageMyGeneral;
