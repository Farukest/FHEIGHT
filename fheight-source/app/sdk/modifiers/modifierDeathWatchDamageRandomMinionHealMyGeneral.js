/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDeathWatch = require('./modifierDeathWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');

class ModifierDeathWatchDamageRandomMinionHealMyGeneral extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchDamageRandomMinionHealMyGeneral";
    this.type ="ModifierDeathWatchDamageRandomMinionHealMyGeneral";
  
    this.modifierName ="Deathwatch";
    this.description ="When a friendly minion dies, deal %X damage to a random minion, and restore %Y Health to your General";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericChain"];
  }

  static createContextObject(damageAmount, healAmount,options) {
    if (damageAmount == null) { damageAmount = 3; }
    if (healAmount == null) { healAmount = 3; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const descriptionText = this.description.replace(/%X/, modifierContextObject.damageAmount);
      return descriptionText.replace(/%Y/, modifierContextObject.healAmount);
    } else {
      return this.description;
    }
  }

  onDeathWatch(action) {
    //if the target is a friendly minion
    if (action.getTarget().getOwnerId() === this.getCard().getOwnerId()) {
      // damage random minion
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        const allMinions = [];
        const units = this.getGameSession().getBoard().getUnits();

        for (var unit of Array.from(units)) {
          if (!unit.getIsGeneral()) {
            allMinions.push(unit);
          }
        }

        if (allMinions.length > 0) {
          const unitToDamage = allMinions[this.getGameSession().getRandomIntegerForExecution(allMinions.length)];
          const damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(unitToDamage);
          damageAction.setDamageAmount(this.damageAmount);
          this.getGameSession().executeAction(damageAction);
        }
      }

      // heal my General
      const myGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      if (myGeneral != null) {
        const healAction = new HealAction(this.getGameSession());
        healAction.setOwnerId(this.getCard().getOwnerId());
        healAction.setTarget(myGeneral);
        healAction.setHealAmount(this.healAmount);
        return this.getGameSession().executeAction(healAction);
      }
    }
  }
}
ModifierDeathWatchDamageRandomMinionHealMyGeneral.initClass();

module.exports = ModifierDeathWatchDamageRandomMinionHealMyGeneral;
