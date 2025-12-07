/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');

class ModifierApplyMinionToBoardWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierApplyMinionToBoardWatch";
    this.type ="ModifierApplyMinionToBoardWatch";
  
    this.modifierName ="Any ApplyToBoard Watch";
    this.description = "Any ApplyToBoard Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierApplyMinionToBoardWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for a unit being applied to board in any way by any player (except transforms)
    if (action instanceof ApplyCardToBoardAction && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && (action.getCard() !== this.getCard())) {
      if (!(action instanceof PlayCardAsTransformAction)) {
        return this.onApplyToBoardWatch(action);
      }
    }
  }

  onApplyToBoardWatch(action) {}
}
ModifierApplyMinionToBoardWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierApplyMinionToBoardWatch;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}