/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const CardType = require('app/sdk/cards/cardType');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const DamageAction = require('app/sdk/actions/damageAction');

class PlayerModifierDamageNextUnitPlayedFromHand extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierDamageNextUnitPlayedFromHand";
    this.type ="PlayerModifierDamageNextUnitPlayedFromHand";
  }

  static createContextObject(damageAmount, duration, options) {
    if (duration == null) { duration = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.durationEndTurn = duration;
    return contextObject;
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;
    // watch for this player playing a card from hand
    if (action instanceof PlayCardFromHandAction) {
      if ((action.getOwnerId() === this.getPlayerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit)) {
        // damage that unit
        const unitToDamage = action.getTarget();
        if (unitToDamage != null) {
          const damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          const appliedByAction = this.getAppliedByAction();
          if (appliedByAction != null) {
            damageAction.setSource(__guardMethod__(appliedByAction.getRootAction(), 'getCard', o => o.getCard().getRootCard()));
          }
          damageAction.setTarget(unitToDamage);
          damageAction.setDamageAmount(this.damageAmount);
          this.getGameSession().executeAction(damageAction);
        }
      }

      // single use, so remove this modifier after a card is played
      return this.getGameSession().removeModifier(this);
    }
  }
}
PlayerModifierDamageNextUnitPlayedFromHand.initClass();


module.exports = PlayerModifierDamageNextUnitPlayedFromHand;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}