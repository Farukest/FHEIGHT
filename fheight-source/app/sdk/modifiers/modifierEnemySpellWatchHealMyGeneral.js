/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemySpellWatch = require('./modifierEnemySpellWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierEnemySpellWatchHealMyGeneral extends ModifierEnemySpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemySpellWatchHealMyGeneral";
    this.type ="ModifierEnemySpellWatchHealMyGeneral";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch", "FX.Modifiers.ModifierGenericHeal"];
  
    this.prototype.healAmount = 0;
  }

  static createContextObject(healAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onEnemySpellWatch(action) {
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
ModifierEnemySpellWatchHealMyGeneral.initClass();

module.exports = ModifierEnemySpellWatchHealMyGeneral;
