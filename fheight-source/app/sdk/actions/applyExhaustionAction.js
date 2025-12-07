/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const CardType =       require('app/sdk/cards/cardType');

class ApplyExhaustionAction extends Action {
  static initClass() {
  
    this.type ="ApplyExhaustionAction";
  }

  constructor(gameSession) {
    super(...arguments);
    if (this.type == null) { this.type = ApplyExhaustionAction.type; }
  }

  _execute() {
    super._execute();
    const target = this.getTarget();
    if (target != null) {
      return target.applyExhaustion();
    }
  }
}
ApplyExhaustionAction.initClass();

module.exports = ApplyExhaustionAction;
