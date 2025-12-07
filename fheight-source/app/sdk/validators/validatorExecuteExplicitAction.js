/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require("app/common/config");
const Validator = require("./validator");
const Player = require("app/sdk/player");
const DrawStartingHandAction = require("app/sdk/actions/drawStartingHandAction");
const MoveAction = require("app/sdk/actions/moveAction");
const AttackAction = require("app/sdk/actions/attackAction");
const PlayCardFromHandAction = require("app/sdk/actions/playCardFromHandAction");
const PlaySignatureCardAction = require("app/sdk/actions/playSignatureCardAction");
const ApplyCardToBoardAction = require("app/sdk/actions/applyCardToBoardAction");
const ReplaceCardFromHandAction = require("app/sdk/actions/replaceCardFromHandAction");
const ResignAction = require("app/sdk/actions/resignAction");
const EndTurnAction = require("app/sdk/actions/endTurnAction");
const RollbackToSnapshotAction = require("app/sdk/actions/rollbackToSnapshotAction");
const EndFollowupAction = require("app/sdk/actions/endFollowupAction");
const i18next = require("i18next");

class ValidatorExecuteExplicitAction extends Validator {
  static initClass() {
  
    this.prototype.type ="ValidatorExecuteExplicitAction";
    this.type ="ValidatorExecuteExplicitAction";
  }

  onValidateAction(event) {
    super.onValidateAction(event);
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && !action.getIsImplicit() && !action.getIsAutomatic() && (action.getType() !== ResignAction.type)) {
      const gameSession = this.getGameSession();
      const owner = action.getOwner();
      if (owner instanceof Player && (gameSession.getIsRunningAsAuthoritative() || (owner.getPlayerId() === gameSession.getMyPlayerId()))) {
        // explicit action by a player
        if (gameSession.isNew()) {
          if (action instanceof DrawStartingHandAction) {
            if (owner.getHasStartingHand()) {
              // player is attempting to draw multiple starting hands
              return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.cant_draw_starting_hand_again_message"));
            } else if (action.getMulliganIndices().length > CONFIG.STARTING_HAND_REPLACE_COUNT) {
              // player is attempting to mulligan more than allowed
              return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.max_replaces_reached_message"));
            }
          } else {
            // player is attempting to execute an explicit action that is not one of the allowed types
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.game_hasnt_started_message"));
          }
        } else if (gameSession.isActive()) {
          if (gameSession.getCurrentTurn().getEnded()) {
            // turn is ended and no more actions are allowed
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.turn_has_ended_message"));
          } else if (owner !== gameSession.getCurrentPlayer()) {
            // player is attempting to execute an explicit action during opponent's turn
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.opponents_turn_message"));
          } else if ((gameSession.getTurnTimeRemaining() <= 0.0) && (action.getType() !== EndTurnAction.type)) {
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.run_out_of_time_message"));
          } else if (owner.getRemainingMana() < action.getManaCost()) {
            // player doesn't have enough mana to execute this explicit action
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.not_enough_mana_message"));
          } else if (!((action.getType() === MoveAction.type) || (action.getType() === AttackAction.type) || (action.getType() === PlayCardFromHandAction.type) || (action.getType() === PlaySignatureCardAction.type) || (action.getType() === ReplaceCardFromHandAction.type) || (action.getType() === EndTurnAction.type) || (action.getType() === EndFollowupAction.type) || (action.getType() === RollbackToSnapshotAction.type) || (action instanceof ApplyCardToBoardAction && __guard__(action.getCard(), x => x.getIsFollowup())))) {
            // player is attempting to execute an explicit action that is not one of the allowed types
            return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.cannot_do_that_message"));
          }
        } else {
          // player is attempting to execute an explicit action when game is neither new nor active
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.game_is_over_message"));
        }
      }
    }
  }
}
ValidatorExecuteExplicitAction.initClass();

module.exports = ValidatorExecuteExplicitAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}