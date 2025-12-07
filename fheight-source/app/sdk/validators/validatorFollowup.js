/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require("app/common/logger");
const EVENTS = require("app/common/event_types");
const Validator = require("./validator");
const ResignAction = require("app/sdk/actions/resignAction");
const EndTurnAction = require("app/sdk/actions/endTurnAction");
const PlayCardAction = require("app/sdk/actions/playCardAction");
const StopBufferingEventsAction = require("app/sdk/actions/stopBufferingEventsAction");
const RollbackToSnapshotAction = require("app/sdk/actions/rollbackToSnapshotAction");
const UtilsGameSession = require("app/common/utils/utils_game_session");
const UtilsPosition = require('app/common/utils/utils_position');
const _ = require('underscore');
const i18next = require("i18next");

class ValidatorFollowup extends Validator {
  static initClass() {
  
    this.prototype.type ="ValidatorFollowup";
    this.type ="ValidatorFollowup";
  
    this.prototype._cardStack = null;
  }

  // region INITIALIZE

  constructor(gameSession) {
    super(gameSession);
    this._cardStack = [];
  }

  // endregion INITIALIZE

  // region EVENTS

  onEvent(event) {
    super.onEvent(event);

    if (event.type === EVENTS.deserialize) {
      return this.clearCardsWithFollowup(event);
    } else if (event.type === EVENTS.modify_action_for_validation) {
      return this.onModifyActionForValidation(event);
    } else if (event.type === EVENTS.added_action_to_queue) {
      return this.onAddedActionToQueue(event);
    }
  }

  // endregion EVENTS

  // region GETTERS / SETTERS

  getCardWaitingForFollowups() {
    return this._cardStack[this._cardStack.length - 1];
  }

  getHasCardsWithFollowup() {
    return this._cardStack.length > 0;
  }

  getActionClearsFollowups(action) {
    return action instanceof StopBufferingEventsAction || action instanceof RollbackToSnapshotAction || action instanceof EndTurnAction || action instanceof ResignAction;
  }

  // endregion GETTERS / SETTERS

  // region CARDS

  clearCardsWithFollowup() {
    if (this._cardStack.length > 0) {
      for (var card of Array.from(this._cardStack)) {
        card.clearFollowups();
      }
      return this._cardStack = [];
    }
  }

  pushCardWithFollowup(card) {
    if (card) {
      return this._cardStack.push(card);
    }
  }

  popCardWaitingForFollowups() {
    if (this.getHasCardsWithFollowup()) {
      const card = this._cardStack.pop();
      return card;
    }
  }

  // endregion CARDS

  // region EVENTS

  onModifyActionForValidation(event) {
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && !action.getIsImplicit() && !this.getActionClearsFollowups(action)) {
      // check against current card waiting for followups
      const cardWaitingForFollowups = this.getCardWaitingForFollowups();
      if ((cardWaitingForFollowups != null) && cardWaitingForFollowups.getIsActionForCurrentFollowup(action)) {
        // action is the current followup this card is waiting for
        // inject followup properties into card so that it is ready for validation and play
        // this is done here instead of by the action creating the card
        // because doing it this way is far better for anti cheat
        return cardWaitingForFollowups.injectFollowupPropertiesIntoCard(action.getCard());
      }
    }
  }

  onValidateAction(event) {
    super.onValidateAction(event);
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && !action.getIsImplicit() && !this.getActionClearsFollowups(action)) {
      // check against current card waiting for followups
      const cardWaitingForFollowups = this.getCardWaitingForFollowups();
      if (cardWaitingForFollowups != null) {
        // always validate against current followup
        const currentFollowupCard = cardWaitingForFollowups.getCurrentFollowupCard();
        const currentFollowupSourcePosition = currentFollowupCard.getFollowupSourcePosition();
        // a followup action is only valid if:
        // - the played card's id matches the id of the current followup (already checked)
        // - the played card's followup options must match the original followup options of the current followup
        // - the played card's target position is a valid target position
        if (!cardWaitingForFollowups.getIsActionForCurrentFollowup(action)) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.invalid_followup_message"));
        } else if ((action.sourcePosition.x !== currentFollowupSourcePosition.x) || (action.sourcePosition.y !== currentFollowupSourcePosition.y)) {
          return this.invalidateAction(action, action.getSourcePosition(), i18next.t("validators.invalid_followup_source_message"));
        } else if (!UtilsPosition.getIsPositionInPositions(currentFollowupCard.getValidTargetPositions(), action.targetPosition)) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.invalid_followup_target_message"));
        }
      }
    }
  }

  onAddedActionToQueue(event) {
    const {
      action
    } = event;
    if (this.getActionClearsFollowups(action)) {
      return this.clearCardsWithFollowup();
    } else if (action && !action.getIsImplicit()) {
      // check against current card waiting for followups
      const cardWaitingForFollowups = this.getCardWaitingForFollowups();
      if (cardWaitingForFollowups != null) {
        // remove current card's current followup as it has been added to queue
        cardWaitingForFollowups.removeCurrentFollowup();
        if (!cardWaitingForFollowups.getHasFollowups()) {
          // pop current card off the stack if it has no more followups remaining
          this.popCardWaitingForFollowups();
        }
      }

      if (action instanceof PlayCardAction) {
        const card = action.getCard();
        if (card && card.getHasFollowups()) {
          // card has followups
          // push it onto the stack
          return this.pushCardWithFollowup(card);
        }
      }
    }
  }
}
ValidatorFollowup.initClass();

  // endregion events

module.exports = ValidatorFollowup;
