/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const TeleportAction = require('./teleportAction');

class TeleportBehindUnitAction extends TeleportAction {
  static initClass() {
  
    this.type = "TeleportBehindUnitAction";
  }

  constructor(gameSession, behindUnit, targetUnit) {
    super(gameSession);
    this.type = TeleportBehindUnitAction.type;
    this._private.behindUnit = behindUnit;
    this.setSource(targetUnit);
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.behindUnit = null; // used by the authoritative source action to know where to teleport

    return p;
  }

  _execute() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // only do calculations server-side
      if ((this._private.behindUnit != null) && this.getSource()) {
        // calculate "in front of me"
        const position = this._private.behindUnit.getPosition();
        position.x += this._private.behindUnit.isOwnedByPlayer1() ? -1 : 1;
        // now set the target position (this is what TeleportAction expects)
        this.setTargetPosition(position);
        return super._execute(); // and execute the teleport
      }
    } else {
      return super._execute();
    }
  }
}
TeleportBehindUnitAction.initClass(); // when not running as authoritative, use authoritative source action's data

module.exports = TeleportBehindUnitAction;
