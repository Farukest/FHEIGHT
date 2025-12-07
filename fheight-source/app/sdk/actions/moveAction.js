/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const Action =       require('./action');
const CardType =       require('app/sdk/cards/cardType');

class MoveAction extends Action {
  static initClass() {
  
    this.type ="MoveAction";
  
    // target and source should always be the same
    this.prototype.getTarget = this.prototype.getSource;
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = MoveAction.type; }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedPath = null;

    return p;
  }

  getPath() {
    if ((this._private.cachedPath == null)) {
      const entity = this.getTarget();
      this._private.cachedPath = entity.getMovementRange().getPathTo(this.getGameSession().getBoard(), entity, this.getTargetPosition());
    }
    return this._private.cachedPath;
  }

  _execute() {
    super._execute();

    const entity = this.getTarget();
    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "MoveAction::execute - moving entity #{entity?.getLogName()} to (#{@getTargetPosition().x},#{@getTargetPosition().y})"

    // force path regeneration before moving entity
    this._private.cachedPath = null;
    this.getPath();

    // move entity
    entity.setPosition(this.getTargetPosition());
    return entity.setMovesMade(entity.getMovesMade() + 1);
  }
}
MoveAction.initClass();

module.exports = MoveAction;
