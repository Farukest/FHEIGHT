/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const Action =     require('./action');
const Colors =     require('colors'); // used for console message coloring
const CardType =     require('app/sdk/cards/cardType');
const _ = require('underscore');

class DamageAction extends Action {
  static initClass() {
  
    this.type ="DamageAction";
    this.prototype.damageAmount = 0;
     // base damage amount, should be set when action first made and then never modified
  }

  constructor(gameSession) {
    super(gameSession);
    if (this.type == null) { this.type = DamageAction.type; }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.damageChange = 0; // flat damage amount shift, set during modify_action_for_execution phase by modifiers (ex: deal 2 additional damage to target)
    p.damageMultiplier = 1; // multiplier to total damage, set during modify_action_for_execution phase by modifiers (ex: increase damage dealth by double)
    p.finalDamageChange = 0; // flat damage amount shift to be applied after initial total is calculated. (ex: reduce all damage dealt to this unit by 2 - after damage boost / multiplier effects)
    p.totalDamageAmount = null; // cached total damage amount once action has been executed (in case game state changes)

    return p;
  }

  getTotalDamageAmount() {
    let totalDamageAmount;
    if ((this._private.totalDamageAmount == null)) {
      // apply 3 levels of damage change in order, but never allow damage amounts to go negative (that would be a heal)
      totalDamageAmount = Math.max(this.getDamageAmount() + this.getDamageChange(), 0); // apply initial flat damage change
      totalDamageAmount = Math.max(totalDamageAmount * this.getDamageMultiplier(), 0); // apply damage multiplier
      totalDamageAmount = Math.max(totalDamageAmount + this.getFinalDamageChange(), 0); // apply final flat damage change
      this._private.totalDamageAmount = Math.floor(totalDamageAmount); // floor the damage
    }
    return this._private.totalDamageAmount;
  }

  // setters / getters
  getDamageAmount() {
    return this.damageAmount;
  }

  setDamageAmount(damageAmount) {
    this.damageAmount = Math.max(damageAmount, 0);
    return this._private.totalDamageAmount = null;
  }

  getDamageChange() {
    return this._private.damageChange;
  }

  setDamageChange(damageChange) {
    this._private.damageChange = damageChange;
    return this._private.totalDamageAmount = null;
  }

  getFinalDamageChange() {
    return this._private.finalDamageChange;
  }

  setFinalDamageChange(damageChange) {
    this._private.finalDamageChange = damageChange;
    return this._private.totalDamageAmount = null;
  }

  getDamageMultiplier() {
    return this._private.damageMultiplier;
  }

  setDamageMultiplier(damageMultiplier) {
    this._private.damageMultiplier = damageMultiplier;
    return this._private.totalDamageAmount = null;
  }

  // convenience setters that take into account previous change values
  changeDamageBy(damageChangeAmount) {
    return this.setDamageChange(this.getDamageChange() + damageChangeAmount);
  }

  changeDamageMultiplierBy(damageMultiplierChangeAmount) {
    return this.setDamageMultiplier(this.getDamageMultiplier() * damageMultiplierChangeAmount);
  }

  changeFinalDamageBy(finalDamageChangeAmount) {
    return this.setFinalDamageChange(this.getFinalDamageChange() + finalDamageChangeAmount);
  }

  _execute() {
    super._execute();

    const source = this.getSource();
    const target = this.getTarget();
    const dmg = this.getTotalDamageAmount();

    if (target && target.getIsActive()) {
      // to do damage we need an active target with hp
      if (target.getHP() > 0) {
        // do damage
        target.applyDamage(dmg);
        //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "#{@getType()}::execute - damage #{dmg} from #{source?.getLogName()} to #{target.getLogName()}. HP: #{target.getHP()} / #{target.getMaxHP()}".red

        // record total damage dealt so far by this player
        if ((source != null) && !source.isOwnedByGameSession()) {
          source.getOwner().totalDamageDealt += dmg;
        }

        if (target.getIsGeneral()) {
          // Doesn't count damage to own general
          if ((source != null) && (source.getOwnerId() !== target.getOwnerId())) {
            __guard__(source.getOwner(), x => x.totalDamageDealtToGeneral += dmg);
          }
        }
      }

      // check if target is at zero hp
      if (target.getHP() <= 0) {
        const dieAction = target.actionDie(source);
        return this.getGameSession().executeAction(dieAction);
      }
    }
  }
}
DamageAction.initClass();

module.exports = DamageAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}