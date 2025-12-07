/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const MoveAction = require('app/sdk/actions/moveAction');

class ModifierMyMoveWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyMoveWatch";
    this.type ="ModifierMyMoveWatch";
  
    this.modifierName ="Move Watch: Self";
    this.description ="Move Watch: Self";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyMoveWatch"];
  }

  onAction(event) {
    super.onAction(event);
    const {
      action
    } = event;
    if (action instanceof MoveAction && (action.getSource() === this.getCard())) {
      return this.onMyMoveWatch(action);
    }
  }

  onMyMoveWatch(action) {}
}
ModifierMyMoveWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyMoveWatch;
