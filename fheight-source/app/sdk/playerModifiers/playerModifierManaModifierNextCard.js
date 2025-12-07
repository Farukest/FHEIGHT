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

class PlayerModifierManaModifierNextCard extends PlayerModifierManaModifier {
  static initClass() {
  
    // single use mana modifier that stays in play ONLY for NEXT card played
    // ex usage - if the next card you play is a minion, reduce its cost by 1
  
    this.prototype.type ="PlayerModifierManaModifierNextCard";
    this.type ="PlayerModifierManaModifierNextCard";
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
              damageAction.setSource(this.getCard());
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
PlayerModifierManaModifierNextCard.initClass();

module.exports = PlayerModifierManaModifierNextCard;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}