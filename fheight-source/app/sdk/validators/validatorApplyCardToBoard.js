/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Validator = require("./validator");
const Entity = require("app/sdk/entities/entity");
const ApplyCardToBoardAction = require("app/sdk/actions/applyCardToBoardAction");
const RandomPlayCardSilentlyAction = require("app/sdk/actions/randomPlayCardSilentlyAction");
const i18next = require("i18next");
const ModifierCustomSpawn = require('app/sdk/modifiers/modifierCustomSpawn');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');

class ValidatorApplyCardToBoard extends Validator {
  static initClass() {
  
    this.prototype.type ="ValidatorApplyCardToBoard";
    this.type ="ValidatorApplyCardToBoard";
  }

  onValidateAction(event) {
    super.onValidateAction(event);
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && action instanceof ApplyCardToBoardAction && !(action instanceof RandomPlayCardSilentlyAction)) {
      // applying a card to board
      const card = action.getCard();
      const targetPosition = action.getTargetPosition();
      if (!this.getGameSession().getBoard().isOnBoard(targetPosition)) {
        // applying a card to a position outside the board
        return this.invalidateAction(action, targetPosition, i18next.t("validators.position_off_board_message"));
      } else if (card instanceof Entity && !(action instanceof PlayCardFromHandAction && card.hasActiveModifierClass(ModifierCustomSpawn))) {
        const obstruction = this.getGameSession().getBoard().getObstructionAtPositionForEntity(targetPosition, card);
        if ((obstruction != null) && !obstruction.getIsRemoved() && this.getGameSession().getCanCardBeScheduledForRemoval(obstruction, true)) {
          // applying an entity to an obstructed position
          return this.invalidateAction(action, targetPosition, i18next.t("validators.obstructed_position_message"));
        }
      }
    }
  }
}
ValidatorApplyCardToBoard.initClass();

module.exports = ValidatorApplyCardToBoard;
