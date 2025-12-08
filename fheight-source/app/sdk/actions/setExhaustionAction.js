/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');

class SetExhaustionAction extends Action {
  static initClass() {
  
    this.type ="SetExhaustionAction";
  
    this.prototype.exhausted = null;
    this.prototype.movesMade = null;
    this.prototype.attacksMade = null;
  }

  constructor() {
    super(...arguments);
    this.type = SetExhaustionAction.type;
  }

  setExhausted(val) {
    return this.exhausted = val;
  }

  getExhausted() {
    return this.exhausted;
  }

  setMovesMade(val) {
    return this.movesMade = val;
  }

  getMovesMade() {
    return this.movesMade;
  }

  setAttacksMade(val) {
    return this.attacksMade = val;
  }

  getAttacksMade() {
    return this.attacksMade;
  }

  _execute() {
    super._execute();
    const target = this.getTarget();
    if (target != null) {
      // match new target's readiness state to that of original unit
      if (this.exhausted != null) { target.setExhausted(this.exhausted); }
      if (this.movesMade != null) { target.setMovesMade(this.movesMade); }
      if (this.attacksMade != null) { return target.setAttacksMade(this.attacksMade); }
    }
  }
}
SetExhaustionAction.initClass();

module.exports = SetExhaustionAction;
