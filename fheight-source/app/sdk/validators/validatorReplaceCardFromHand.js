/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Validator = require("./validator");
const Player = require("app/sdk/player");
const ReplaceCardFromHandAction = require("app/sdk/actions/replaceCardFromHandAction");
const _ = require('underscore');
const i18next = require("i18next");

class ValidatorReplaceCardFromHand extends Validator {

  onValidateAction(event) {
    super.onValidateAction(event);
    const gameSession = this.getGameSession();
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && action instanceof ReplaceCardFromHandAction && !(action.getIsForcedReplace())) {
      const owner = action.getOwner();
      if (owner instanceof Player) {
        const deck = owner.getDeck();
        if ((gameSession.getIsRunningAsAuthoritative() || (owner.getPlayerId() === gameSession.getMyPlayerId())) && (deck.getCardIndexInHandAtIndex(action.indexOfCardInHand) == null)) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.invalid_card_to_replace_message"));
        } else if (!deck.getCanReplaceCardThisTurn()) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.out_of_replaces_message"));
        }
      }
    }
  }
}

module.exports = ValidatorReplaceCardFromHand;
