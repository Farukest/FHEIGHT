/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierDealOrTakeDamageWatch = require('./modifierDealOrTakeDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierDealOrTakeDamageWatchRandomTeleportOther extends ModifierDealOrTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealOrTakeDamageWatchRandomTeleportOther";
    this.type ="ModifierDealOrTakeDamageWatchRandomTeleportOther";
  
    this.description ="Whenever an enemy damages or takes damage from this, teleport that enemy to a random location";
  }

  onDealOrTakeDamage(action) {
    let targetToTeleport;
    super.onDealOrTakeDamage(action);

    // if the target of the action is this unit, the unit is receiving the damage
    if (action.getTarget() === this.getCard()) {
      targetToTeleport = __guard__(action.getSource(), x => x.getAncestorCardOfType(CardType.Unit));
      if (!targetToTeleport) { // If we couldn't find a unit that dealt the damage, assume the source of damage was spell, in which case teleport the general
        targetToTeleport = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      }
    } else if (action.getTarget().getOwnerId() !== this.getCard().getOwnerId()) { // else we are dealing damage
      targetToTeleport = action.getTarget();
    }

    if ((targetToTeleport != null) && !_.contains(this._private.cardIndicesTeleported, targetToTeleport.getIndex())) {
      this._private.cardIndicesTeleported.push(targetToTeleport.getIndex());
      const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
      randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
      randomTeleportAction.setSource(targetToTeleport);
      randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
      return this.getGameSession().executeAction(randomTeleportAction);
    }
  }

  updateCachedState() {
    super.updateCachedState();
    return this._private.cardIndicesTeleported.length = 0;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.cardIndicesTeleported = [];

    return p;
  }
}
ModifierDealOrTakeDamageWatchRandomTeleportOther.initClass();

module.exports = ModifierDealOrTakeDamageWatchRandomTeleportOther;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}