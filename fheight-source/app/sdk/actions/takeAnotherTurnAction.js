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

class TakeAnotherTurnAction extends Action {
  static initClass() {
  
    this.type ="TakeAnotherTurnAction";
  }

  constructor() {
    super(...arguments);
    this.type = TakeAnotherTurnAction.type;
  }

  _execute() {
    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "#{this.type}::execute - setting current player to take a second turn"
    if (this.getGameSession().willSwapCurrentPlayerNextTurn()) {
      return this.getGameSession().skipSwapCurrentPlayerNextTurn();
    }
  }
}
TakeAnotherTurnAction.initClass();

module.exports = TakeAnotherTurnAction;
