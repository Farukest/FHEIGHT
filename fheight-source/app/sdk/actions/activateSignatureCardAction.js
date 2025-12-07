/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');

/*
Action that activates a player's signature card.
*/

class ActivateSignatureCardAction extends Action {
  static initClass() {
  
    this.type ="ActivateSignatureCardAction";
  
    this.prototype.targetPlayerId = null;
  }

  constructor(gameSession, targetPlayerId) {
    super(gameSession);
    if (this.type == null) { this.type = ActivateSignatureCardAction.type; }
    if (targetPlayerId != null) {
      this.targetPlayerId = targetPlayerId;
    } else {
      this.targetPlayerId = this.getOwnerId();
    }
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  getTargetPlayer() {
    return this.getGameSession().getPlayerById(this.getTargetPlayerId());
  }

  getTargetPlayerId() {
    return this.targetPlayerId;
  }

  _execute() {
    super._execute();

    return this.getTargetPlayer().setIsSignatureCardActive(true);
  }
}
ActivateSignatureCardAction.initClass();

module.exports = ActivateSignatureCardAction;
