/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Validator = require("./validator");
const Card = require("app/sdk/cards/card");
const RevealHiddenCardAction = require("app/sdk/actions/revealHiddenCardAction");
const RemoveModifierAction = require("app/sdk/actions/removeModifierAction");
const i18next = require("i18next");

class ValidatorScheduledForRemoval extends Validator {
  static initClass() {
  
    this.prototype.type ="ValidatorScheduledForRemoval";
    this.type ="ValidatorScheduledForRemoval";
  }

  onValidateAction(event) {
    super.onValidateAction(event);
    const {
      action
    } = event;
    if ((action != null) && action.getIsValid() && action.getIsImplicit() && !(action instanceof RemoveModifierAction || action instanceof RevealHiddenCardAction)) {
      const target = action.getTarget();
      if (target instanceof Card && target.getIsPlayed()) {
        if (target.getIsRemoved()) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.card_has_been_removed_message"));
        } else if (!action.getIsDepthFirst() && !this.getGameSession().getCanCardBeScheduledForRemoval(target)) {
          return this.invalidateAction(action, action.getTargetPosition(), i18next.t("validators.card_will_be_removed_message"));
        }
      }
    }
  }
}
ValidatorScheduledForRemoval.initClass();

module.exports = ValidatorScheduledForRemoval;
