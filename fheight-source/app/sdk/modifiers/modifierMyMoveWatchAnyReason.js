/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const MoveAction = require('app/sdk/actions/moveAction');
const TeleportAction = require('app/sdk/actions/teleportAction');
const SwapUnitsAction = require('app/sdk/actions/swapUnitsAction');

class ModifierMyMoveWatchAnyReason extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyMoveWatchAnyReason";
    this.type ="ModifierMyMoveWatchAnyReason";
  
    this.modifierName ="Move Watch Any Reason: Self";
    this.description ="Move Watch Any Reason: Self";
  
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

    if ((action instanceof MoveAction || (action instanceof TeleportAction && action.getIsValidTeleport())) && (action.getSource() === this.getCard())) {
      return this.onMyMoveWatchAnyReason(action);
    } else if (action instanceof SwapUnitsAction && ((action.getSource() === this.getCard()) || (action.getTarget() === this.getCard()))) {
      return this.onMyMoveWatchAnyReason(action);
    }
  }

  onMyMoveWatchAnyReason(action) {}
}
ModifierMyMoveWatchAnyReason.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyMoveWatchAnyReason;
