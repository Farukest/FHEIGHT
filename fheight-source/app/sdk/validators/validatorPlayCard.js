/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Validator = require("./validator");
const Player = require("app/sdk/player");
const PlayCardFromHandAction = require("app/sdk/actions/playCardFromHandAction");
const PlaySignatureCardAction = require("app/sdk/actions/playSignatureCardAction");
const DamageAction = require("app/sdk/actions/damageAction");
const _ = require("underscore");
const i18next = require("i18next");

class ValidatorPlayCard extends Validator {
  static initClass() {
  
    this.prototype.type ="ValidatorPlayCard";
    this.type ="ValidatorPlayCard";
  }

  onValidateAction(event) {
    super.onValidateAction(event);
    const gameSession = this.getGameSession();
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && !action.getIsImplicit() && (action instanceof PlayCardFromHandAction || action instanceof PlaySignatureCardAction)) {
      const card = action.getCard();
      const targetPosition = action.getTargetPosition();
      const owner = action.getOwner();
      if ((card == null)) {
        // playing nothing
        return this.invalidateAction(action, targetPosition, i18next.t("validators.invalid_card_message"));
      } else if (gameSession.getIsRunningAsAuthoritative() && (action.cardDataOrIndex != null) && _.isObject(action.cardDataOrIndex)) {
        // playing card data instead of index
        return this.invalidateAction(action, targetPosition, i18next.t("validators.invalid_card_message"));
      } else if (!card.getIsPositionValidTarget(targetPosition)) {
        // playing card to board at an invalid position
        return this.invalidateAction(action, targetPosition, i18next.t("validators.invalid_card_target_message"));
      } else if (gameSession.getIsRunningAsAuthoritative() || (owner.getPlayerId() === gameSession.getMyPlayerId())) {
        if (action instanceof PlayCardFromHandAction) {
          if (card.getIndex() !== owner.getDeck().getCardIndexInHandAtIndex(action.indexOfCardInHand)) {
            // playing a card that does not match the index in hand
            return this.invalidateAction(action, targetPosition, i18next.t("validators.invalid_card_message"));
          } else { // validate that player is not simply stalling out the game
            let actions = [];
            const currentTurn = this.getGameSession().getCurrentTurn();
            for (var step of Array.from(currentTurn.getSteps())) {
              actions = actions.concat(step.getAction().getFlattenedActionTree());
            }

            let hasFoundMeaningfulAction = false;
            let numCardsPlayedFromHand = 0;
            for (let i = actions.length - 1; i >= 0; i--) {
              var a = actions[i];
              if (a instanceof PlayCardFromHandAction) {
                numCardsPlayedFromHand++;
              }
              if (a instanceof DamageAction) {
                hasFoundMeaningfulAction = true;
              }
              if (numCardsPlayedFromHand >= 10) {
                break;
              }
            }
            if ((numCardsPlayedFromHand >= 10) && !hasFoundMeaningfulAction) {
              return this.invalidateAction(action, targetPosition, "Too many cards played without advancing board state.");
            }
          }
        } else if (action instanceof PlaySignatureCardAction) {
          if (!card.getOwner().getIsSignatureCardActive()) {
            // trying to play signature card when it should not be active
            return this.invalidateAction(action, targetPosition, i18next.t("validators.card_isnt_ready_message"));
          } else if (card.getIndex() !== owner.getCurrentSignatureCardIndex()) {
            // playing a card that does not match the index of the current signature card
            return this.invalidateAction(action, targetPosition, i18next.t("validators.invalid_card_message"));
          }
        }
      }
    }
  }
}
ValidatorPlayCard.initClass();

module.exports = ValidatorPlayCard;
