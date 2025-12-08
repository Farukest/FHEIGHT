/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Action =     require('./action');
const Logger =     require('app/common/logger');

class EndTurnAction extends Action {
  static initClass() {
  
    this.type ="EndTurnAction";
  }

  constructor() {
    super(...arguments);
    this.type = EndTurnAction.type;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  _execute() {
    return this.getGameSession().p_endTurn();
  }
}
EndTurnAction.initClass();

module.exports = EndTurnAction;
