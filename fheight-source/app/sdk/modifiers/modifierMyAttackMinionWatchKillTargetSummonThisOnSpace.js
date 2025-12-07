/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackMinionWatch = require('./modifierMyAttackMinionWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const KillAction = require('app/sdk/actions/killAction');

class ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace extends ModifierMyAttackMinionWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace";
    this.type ="ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericKill"];
  
    this.prototype.maxStacks = 1;
  }

  onMyAttackMinionWatch(action) {
    const target = action.getTarget();
    if (target != null) {
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(target);
      this.getGameSession().executeAction(killAction);

      const position = target.getPosition();
      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.getCard().createNewCardData());
      playCardAction.setSource(this.getCard());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace.initClass();

module.exports = ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace;
