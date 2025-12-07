/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierFriendlyDeathWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierFriendlyDeathWatch";
    this.type ="ModifierFriendlyDeathWatch";
  
    this.modifierName ="ModifierFriendlyDeathWatch";
    this.description = "Whenever a friendly minion dies...";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierFriendlyDeathwatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    const target = action.getTarget();
    const entity = this.getCard();
    // watch for a friendly unit dying
    if (action instanceof DieAction && ((target != null ? target.type : undefined) === CardType.Unit) && (target !== entity) && (target.getOwnerId() === entity.getOwnerId())) {
      return this.onFriendlyDeathWatch(action);
    }
  }

  onFriendlyDeathWatch(action) {}
}
ModifierFriendlyDeathWatch.initClass();
    // override me in sub classes to implement special behavior


module.exports = ModifierFriendlyDeathWatch;
