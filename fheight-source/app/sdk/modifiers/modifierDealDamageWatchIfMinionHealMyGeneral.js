/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatchHealMyGeneral = require('./modifierDealDamageWatchHealMyGeneral');

class ModifierDealDamageWatchIfMinionHealMyGeneral extends ModifierDealDamageWatchHealMyGeneral {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchIfMinionHealMyGeneral";
    this.type ="ModifierDealDamageWatchIfMinionHealMyGeneral";
  
    this.modifierName ="Deal Damage Watch";
    this.description ="Whenever this minion deals damage to a minion, restore Health to your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  onDealDamage(action) {

    const target = action.getTarget();
    if ((target != null) && !target.getIsGeneral()) {
      return super.onDealDamage(action);
    }
  }
}
ModifierDealDamageWatchIfMinionHealMyGeneral.initClass();

module.exports = ModifierDealDamageWatchIfMinionHealMyGeneral;
