/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');

class ModifierReplaceWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierReplaceWatch";
    this.type ="ModifierReplaceWatch";
  
    this.modifierName ="Replace Watch";
    this.description = "Replace Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierReplaceWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for my player replacing a card
    if (action instanceof ReplaceCardFromHandAction && (action.getOwnerId() === this.getCard().getOwnerId())) {
      return this.onReplaceWatch(action);
    }
  }

  onReplaceWatch(action) {}
}
ModifierReplaceWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierReplaceWatch;
