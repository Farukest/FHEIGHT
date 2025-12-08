/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const DieAction = require('./dieAction');
const GameStatus = require('app/sdk/gameStatus');


class ResignAction extends DieAction {
  static initClass() {
  
    this.type ="ResignAction";
  }

  constructor() {
    super(...arguments);
    this.type = ResignAction.type;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  _execute() {
    super._execute();
    return this.getGameSession().getPlayerById(this.getOwnerId()).hasResigned = true;
  }
}
ResignAction.initClass();

module.exports = ResignAction;
