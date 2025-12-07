/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const GenerateSignatureCardAction = require('./generateSignatureCardAction');

/*
Action that forces signature card data to be refreshed for player
Generates a new signature card if signature card slot was active when this action executes
*/

class UpdateSignatureCardAction extends Action {
  static initClass() {
  
    this.type ="UpdateSignatureCardAction";
  
    this.prototype.targetPlayerId = null;
  }

  constructor(gameSession, targetPlayerId) {
    super(gameSession);
    if (this.type == null) { this.type = UpdateSignatureCardAction.type; }
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

    const activeSignatureCard = this.getTargetPlayer().getCurrentSignatureCard();
    if (activeSignatureCard) {
      return this.getGameSession().executeAction(this.getTargetPlayer().actionGenerateSignatureCard());
    } else {
      this.getTargetPlayer().flushCachedReferenceSignatureCard();
      return this.getGameSession().getGeneralForPlayerId(this.getTargetPlayerId()).flushCachedReferenceSignatureCard();
    }
  }
}
UpdateSignatureCardAction.initClass();

module.exports = UpdateSignatureCardAction;
