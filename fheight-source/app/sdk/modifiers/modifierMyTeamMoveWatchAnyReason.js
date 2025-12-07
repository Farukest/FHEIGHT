/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const MoveAction = require('app/sdk/actions/moveAction');
const TeleportAction = require('app/sdk/actions/teleportAction');
const SwapUnitsAction = require('app/sdk/actions/swapUnitsAction');

class ModifierMyTeamMoveWatchAnyReason extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyTeamMoveWatchAnyReason";
    this.type ="ModifierMyTeamMoveWatchAnyReason";
  
    this.modifierName ="Any Move Watch: Self";
    this.description ="Whenever a friendly minion is moved for any reason...";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyMoveWatch"];
  }

  onAction(event) {
    super.onAction(event);
    const {
      action
    } = event;
    if ((action instanceof MoveAction || (action instanceof TeleportAction && action.getIsValidTeleport())) && (action.getSource().getOwnerId() === this.getCard().getOwnerId()) && !__guardMethod__(action.getSource(), 'getIsGeneral', o => o.getIsGeneral())) {
      return this.onMyTeamMoveWatch(action, action.getSource());
    } else if (action instanceof SwapUnitsAction) { // for swap units action, must check both source AND target (both could be on my team)
      if ((action.getSource().getOwnerId() === this.getCard().getOwnerId()) && !__guardMethod__(action.getSource(), 'getIsGeneral', o1 => o1.getIsGeneral())) {
        this.onMyTeamMoveWatch(action, action.getSource());
      }
      if ((action.getTarget().getOwnerId() === this.getCard().getOwnerId()) && !__guardMethod__(action.getTarget(), 'getIsGeneral', o2 => o2.getIsGeneral())) {
        return this.onMyTeamMoveWatch(action, action.getTarget());
      }
    }
  }

  onMyTeamMoveWatch(action, buffTarget) {}
}
ModifierMyTeamMoveWatchAnyReason.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyTeamMoveWatchAnyReason;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}