/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierManaModifier = require('app/sdk/playerModifiers/playerModifierManaModifier');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierFlashReincarnation extends PlayerModifierManaModifier {
  static initClass() {
  
    // single use mana modifier that stays in play ONLY for NEXT card played
    // ex usage - if the next card you play is a minion, reduce its cost by 1
    // this version will ALSO damage the next minion played (while modifier is active)
  
    this.prototype.type ="PlayerModifierFlashReincarnation";
    this.type ="PlayerModifierFlashReincarnation";
  
    this.prototype.damageAmount = 2;
  }

  onAction(event) {
    super.onAction(event);

    // when a card is played from hand AFTER this modifier is applied
    const {
      action
    } = event;
    if ((action.getIndex() > this.getAppliedByActionIndex()) && ((action instanceof PlayCardFromHandAction && this.auraIncludeHand) || (action instanceof PlaySignatureCardAction && this.auraIncludeSignatureCards)) && (action.getOwnerId() === this.getPlayerId())) {
      const card = action.getCard();
      if (card != null) {
        if (action instanceof PlayCardFromHandAction) {
          if ((action.getOwnerId() === this.getPlayerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit)) {
            // damage the unit IF a unit was played
            const unitToDamage = action.getTarget();
            if (unitToDamage != null) {
              const damageAction = new DamageAction(this.getGameSession());
              damageAction.setOwnerId(this.getCard().getOwnerId());
              const appliedByAction = this.getAppliedByAction();
              if (appliedByAction != null) {
                damageAction.setSource(__guardMethod__(appliedByAction.getRootAction(), 'getCard', o => o.getCard().getRootCard()));
              } else {
                damageAction.setSource(this.getCard());
              }
              damageAction.setTarget(unitToDamage);
              damageAction.setDamageAmount(this.damageAmount);
              this.getGameSession().executeAction(damageAction);
            }
          }
        }
        // always remove modifier after any card is played (next card only)
        return this.getGameSession().removeModifier(this);
      }
    }
  }
}
PlayerModifierFlashReincarnation.initClass();

module.exports = PlayerModifierFlashReincarnation;

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