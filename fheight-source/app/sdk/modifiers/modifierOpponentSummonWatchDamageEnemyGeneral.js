/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOpponentSummonWatchDamageEnemyGeneral extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchDamageEnemyGeneral";
    this.type ="ModifierOpponentSummonWatchDamageEnemyGeneral";
  
    this.modifierName ="Opponent Summon Watch";
    this.description = "Whenever your opponent summons a minion, deal %X damage to the enemy General";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentSummonWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(damageAmount,options) {
    if (damageAmount == null) { damageAmount = 0; }
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

  onSummonWatch(action) {
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setTarget(general);
      if (!this.damageAmount) {
        damageAction.setDamageAmount(this.getCard().getATK());
      } else {
        damageAction.setDamageAmount(this.damageAmount);
      }
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierOpponentSummonWatchDamageEnemyGeneral.initClass();

module.exports = ModifierOpponentSummonWatchDamageEnemyGeneral;
