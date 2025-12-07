/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCannot = require('./modifierCannot');
const RemoveCardFromHandAction = require('app/sdk/actions/removeCardFromHandAction');
const i18next = require('i18next');

class ModifierCannotBeRemovedFromHand extends ModifierCannot {
  static initClass() {
  
    this.prototype.type = "ModifierCannotBeRemovedFromHand";
    this.type = "ModifierCannotBeRemovedFromHand";
  
    this.prototype.activeInHand = true;
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    if (a instanceof RemoveCardFromHandAction && a.getIsValid() && this.getCard().getIsLocatedInHand()) {
      if (__guard__(this.getCard().getOwner().getDeck().getCardInHandAtIndex(a.indexOfCardInHand), x => x.getIndex()) === this.getCard().getIndex()) {
        return this.invalidateAction(a, this.getCard().getPosition());
      }
    }
  }
}
ModifierCannotBeRemovedFromHand.initClass();

module.exports = ModifierCannotBeRemovedFromHand;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}