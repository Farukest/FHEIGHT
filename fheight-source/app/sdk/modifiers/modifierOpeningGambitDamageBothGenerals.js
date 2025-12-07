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


class ModifierOpeningGambitDamageBothGenerals extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageBothGenerals";
    this.type = "ModifierOpeningGambitDamageBothGenerals";
  
    this.modifierName = "Opening Gambit";
    this.description = "Deal %X damage to BOTH Generals";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericDamageFire"];
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
    this.getGameSession().executeAction(damageAction);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());

    const enemyDamageAction = new DamageAction(this.getGameSession());
    enemyDamageAction.setOwnerId(this.getCard().getOwnerId());
    enemyDamageAction.setSource(this.getCard());
    enemyDamageAction.setTarget(enemyGeneral);
    enemyDamageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(enemyDamageAction);
  }
}
ModifierOpeningGambitDamageBothGenerals.initClass();

module.exports = ModifierOpeningGambitDamageBothGenerals;
