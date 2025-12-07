/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOpeningGambitStealEnemyGeneralHealth extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitStealEnemyGeneralHealth";
    this.type ="ModifierOpeningGambitStealEnemyGeneralHealth";
  
    this.description = "Your General steals X Health from the enemy General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  
    this.prototype.damageAmount = 0;
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject();
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onOpeningGambit() {

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(this.damageAmount);
    this.getGameSession().executeAction(healAction);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getOwnerId());
    damageAction.setTarget(enemyGeneral);
    damageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
ModifierOpeningGambitStealEnemyGeneralHealth.initClass();

module.exports = ModifierOpeningGambitStealEnemyGeneralHealth;
