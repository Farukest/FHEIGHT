/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Action = require('./action');
const CardType = require('app/sdk/cards/cardType');

class SwapUnitsAction extends Action {
  static initClass() {
  
    this.type = "SwapUnitsAction";
    this.prototype.fxResource = ["FX.Actions.Teleport"];
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = SwapUnitsAction.type; }
  }

  _execute() {

    super._execute();

    if ((this.getSource() != null) && (this.getTarget() != null)) {
      // normally we'll swap these units based on where they were when the action was created
      // but if either unit wasn't yet on the board at action creation, re-evaluate
      // their positions at action execution
      const board = this.getGameSession().getBoard();

      if (!board.isOnBoard(this.getTargetPosition()) || !board.isOnBoard(this.getSourcePosition())) {
        this.setTargetPosition(this.getTarget().getPosition());
        this.setSourcePosition(this.getSource().getPosition());
      }

      if (board.isOnBoard(this.getTargetPosition()) && board.isOnBoard(this.getSourcePosition())) {
        this.getSource().setPosition(this.getTargetPosition());
        return this.getTarget().setPosition(this.getSourcePosition());
      }
    }
  }
}
SwapUnitsAction.initClass();

module.exports = SwapUnitsAction;
