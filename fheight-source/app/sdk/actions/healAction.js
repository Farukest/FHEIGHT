/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const Action =       require('./action');
const CardType =       require('app/sdk/cards/cardType');

class HealAction extends Action {
  static initClass() {
  
    this.type ="HealAction";
    this.prototype.healAmount = 0;
     // base heal amount, should be set when action first made and then never modified
  }

  constructor() {
    super(...arguments);
    this.type = HealAction.type;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.healChange = 0; // flat heal amount shift, set during modify_action_for_execution phase by modifiers
    p.healMultiplier = 1; // multiplier to total heal, set during modify_action_for_execution phase by modifiers
    p.totalHealAmount = null; // cached total heal amount once action has been executed (in case game state changes)
    p.totalHealApplied = null; // cached total heal amount actually applied once action has been executed (ex: Heal for 5 on a unit with 2 damage, totalHealApplied=2)

    return p;
  }

  getTotalHealAmount() {
    if (this._private.totalHealAmount == null) { this._private.totalHealAmount = (this.getHealAmount() + this.getHealChange()) * this.getHealMultiplier(); }
    return this._private.totalHealAmount;
  }

  getHealAmount() {
    return this.healAmount;
  }

  setHealAmount(healAmount) {
    this.healAmount = healAmount;
    return this._private.totalHealAmount = null;
  }

  getHealChange() {
    return this._private.healChange;
  }

  setHealChange(healChange) {
    this._private.healChange = healChange;
    return this._private.totalHealAmount = null;
  }

  getHealMultiplier() {
    return this._private.healMultiplier;
  }

  setHealMultiplier(healMultiplier) {
    this._private.healMultiplier = healMultiplier;
    return this._private.totalHealAmount = null;
  }

  getTotalHealApplied() {
    return this._private.totalHealApplied;
  }

  _execute() {
    super._execute();

    const target = this.getTarget();

    if ((target != null) && target.getIsActive()) {
      const heal = this.getTotalHealAmount();
      const targetStartHP = target.getHP();
      target.applyHeal(heal); // heal the target
      const targetEndHP = target.getHP();
      return this._private.totalHealApplied = targetEndHP - targetStartHP;
    } else {
      return this._private.totalHealApplied = 0;
    }
  }
}
HealAction.initClass();


module.exports = HealAction;
