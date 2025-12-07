/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyTakeDamageWatch = require('./modifierEnemyTakeDamageWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierEnemyTakeDamageWatchHealMyGeneral extends ModifierEnemyTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyTakeDamageWatchHealMyGeneral";
    this.type ="ModifierEnemyTakeDamageWatchHealMyGeneral";
  
    this.modifierName ="Enemy Take Damage Watch Heal My General";
    this.description ="Whenever an enemy minion or General takes damage, restore %X Health to your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEnemyTakeDamageWatchHealMyGeneral"];
  }

  static createContextObject(healAmount, options) {
    if (healAmount == null) { healAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.healAmount);
    } else {
      return this.description;
    }
  }

  onEnemyDamageTaken(action) {
    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (myGeneral != null) {
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.getCard().getOwnerId());
      healAction.setTarget(myGeneral);
      healAction.setHealAmount(this.healAmount);
      return this.getGameSession().executeAction(healAction);
    }
  }
}
ModifierEnemyTakeDamageWatchHealMyGeneral.initClass();

module.exports = ModifierEnemyTakeDamageWatchHealMyGeneral;
