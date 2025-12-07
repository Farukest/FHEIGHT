/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierFirstBlood = require('./modifierFirstBlood');
const RefreshExhaustionAction = require('app/sdk/actions/refreshExhaustionAction');

class ModifierInvalidateRush extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierInvalidateRush";
    this.type ="ModifierInvalidateRush";
  
    this.modifierName ="ModifierInvalidateRush";
    this.description = "Whenever ANY player summons a minion with Rush, exhaust it";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierInvalidateRush"];
  }


  onValidateAction(actionEvent) {
    super.onValidateAction(actionEvent);

    const {
      action
    } = actionEvent;
    // block refresh exhaustion actions triggered by a Rush modifier
    // note: we have to check against gamesession triggering modifier here since this is pre-validation, triggering modifier relationship is not yet set
    if (action instanceof RefreshExhaustionAction && !__guard__(action.getTarget(), x => x.getIsGeneral()) && this.getGameSession().getTriggeringModifier() instanceof ModifierFirstBlood) {
      return this.invalidateAction(action);
    }
  }
}
ModifierInvalidateRush.initClass();

module.exports = ModifierInvalidateRush;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}