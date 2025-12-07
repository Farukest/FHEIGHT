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

class RemoveAction extends Action {
  static initClass() {
  
    this.type ="RemoveAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = RemoveAction.type; }
  }

  _execute() {
    super._execute();

    const target = this.getTarget();
    const targetPosition = this.getTargetPosition();

    return this.getGameSession().removeCardFromBoard(target, targetPosition.x, targetPosition.y, this);
  }
}
RemoveAction.initClass();

module.exports = RemoveAction;
