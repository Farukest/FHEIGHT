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
const GameStatus =   require('app/sdk/gameStatus');
const Logger =     require('app/common/logger');

class RollbackToSnapshotAction extends Action {
  static initClass() {
  
    this.type ="RollbackToSnapshotAction";
  
    this.prototype.delay = CONFIG.TURN_DELAY;
  }

  constructor() {
    super(...arguments);
    this.type = RollbackToSnapshotAction.type;
  }

  _execute() {
    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "#{this.type}::execute"
    return this.getGameSession().p_requestRollbackToSnapshot();
  }
}
RollbackToSnapshotAction.initClass();

module.exports = RollbackToSnapshotAction;
