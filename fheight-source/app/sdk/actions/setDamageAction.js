/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const CardType = require('app/sdk/cards/cardType');

class SetDamageAction extends Action {
  static initClass() {
  
    this.type ="SetDamageAction";
    this.prototype.damageValue = 0;
  }

  constructor() {
    super(...arguments);
    this.type = SetDamageAction.type;
  }

  _execute() {
    super._execute();

    const source = this.getSource();
    const target = this.getTarget();

    if (target != null) {
      return target.setDamage(this.damageValue);
    }
  }
}
SetDamageAction.initClass();

module.exports = SetDamageAction;
