/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierManaModifier = require('app/sdk/playerModifiers/playerModifierManaModifier');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');

class PlayerModifierManaModifierOncePerTurn extends PlayerModifierManaModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierManaModifierOncePerTurn";
    this.type ="PlayerModifierManaModifierOncePerTurn";
  
    this.prototype.canChangeCost = true;
     // can change cost of cards once per turn
  }

  onAction(event) {
    // only do this check on authoritative side because server will know if anything modified the playCardAction and can check original card
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      super.onAction(event);

      // when a card was played from hand
      const {
        action
      } = event;
      if ((action instanceof PlayCardFromHandAction && this.auraIncludeHand) || ((action instanceof PlaySignatureCardAction && this.auraIncludeSignatureCards) && (action.getOwnerId() === this.getPlayerId()))) {
        let card;
        if (action.overrideCardData) {
          card = action._private.originalCard;
        } else {
          card = action.getCard();
        }
        if (card != null) {
          // turn off once per turn mana modifiers in play but only if they affected the card
          const modifiers = card.getModifiers();
          return (() => {
            const result = [];
            for (var modifier of Array.from(modifiers)) {
            // if the card has any active modifiers that this is the parent modifier for
            // then we know this modifier was used to modify the cost of the card
              if (modifier instanceof ModifierManaCostChange && (modifier.getAppliedByModifierIndex() === this.getIndex())) {
                this.canChangeCost = false; // can't change cost again this turn
                break;
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        }
      }
    }
  }

  getIsActiveForCache() {
    return super.getIsActiveForCache() && this.canChangeCost;
  }

  _onEndTurn(actionEvent) {
    // use private _onEndTurn because if this modifier was marked inactive already onEndTurn won't be called
    this.canChangeCost = true; // reset flag so that this can change cost of cards again
    return super._onEndTurn(actionEvent);
  }
}
PlayerModifierManaModifierOncePerTurn.initClass();

module.exports = PlayerModifierManaModifierOncePerTurn;
