/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierEmblem = require('./playerModifierEmblem');
const CardType = require('app/sdk/cards/cardType');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');
const SwapUnitAllegianceAction = require('app/sdk/actions/swapUnitAllegianceAction');
const RemoveAction = require('app/sdk/actions/removeAction');

class PlayerModifierEmblemGainMinionOrLoseControlWatch extends PlayerModifierEmblem {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEmblemGainMinionOrLoseControlWatch";
    this.type ="PlayerModifierEmblemGainMinionOrLoseControlWatch";
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    if (this.getIsActionRelevantForGainMinion(action)) {
      return this.onGainMinionWatch(action);
    } else if (this.getIsActionRelevantForLoseControl(action)) {
      return this.onLoseControlWatch(action);
    }
  }

  getIsActionRelevantForGainMinion(action) {

    if (action != null) {
      const target = action.getTarget();
      if (target != null) {
        if ((target.type === CardType.Unit) && ((action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getCard().getOwnerId())) || (action instanceof SwapUnitAllegianceAction && (target.getOwnerId() === this.getCard().getOwnerId())))) {
          return true;
        }
      }
    }
    return false;
  }

  getIsActionRelevantForLoseControl(action) {

    if (action != null) {
      const target = action.getTarget();
      if (target != null) {
        if ((target.type === CardType.Unit) && action instanceof SwapUnitAllegianceAction && (target.getOwnerId() !== this.getCard().getOwnerId())) {
          return true;
        }
      }
    }
    return false;
  }

  onLoseControlWatch(action) {}
    // override me in sub classes to implement special behavior

  onGainMinionWatch(action) {}
}
PlayerModifierEmblemGainMinionOrLoseControlWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = PlayerModifierEmblemGainMinionOrLoseControlWatch;
