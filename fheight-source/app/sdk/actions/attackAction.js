/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const DamageAction =   require('./damageAction');
const CardType =       require('app/sdk/cards/cardType');
const _ = require('underscore');

class AttackAction extends DamageAction {
  static initClass() {
  
    this.type ="AttackAction";
  }

  constructor(gameSession) {
    super(gameSession);
    this.type = AttackAction.type;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // cache
    p.isStrikebackAllowed = true; // normally target of attack actions will strike back, but in some cases strike back should be supressed

    return p;
  }

  getDamageAmount() {
    // attack damage amount is always source's atk value
    const source = this.getSource();
    if (source != null) { return source.getATK(); } else { return 0; }
  }

  setDamageAmount() {}
    // does nothing for attacks

  setIsStrikebackAllowed(isStrikebackAllowed) {
    return this._private.isStrikebackAllowed = isStrikebackAllowed;
  }

  getIsStrikebackAllowed() {
    return this._private.isStrikebackAllowed;
  }

  _execute() {

    super._execute();

    const attacker = this.getSource();

    if (attacker != null) {
      if (!this.getIsImplicit()) { return attacker.setAttacksMade(attacker.getAttacksMade() + 1); }
    }
  }
}
AttackAction.initClass();

module.exports = AttackAction;
