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
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');

class ModifierSummonWatchAnyPlayer extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchAnyPlayer";
    this.type ="ModifierSummonWatchAnyPlayer";
  
    this.modifierName ="Summon Watch Any Player";
    this.description = "Summon Watch Any Player";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for a unit being summoned in any way by any player, but don't react to transforms
    if (this.getIsActionRelevant(action) && this.getIsCardRelevantToWatcher(action.getCard())) {
      return this.onSummonWatch(action);
    }
  }

  getIsActionRelevant(action) {
    return action instanceof ApplyCardToBoardAction && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && (action.getCard() !== this.getCard()) && !(action instanceof PlayCardAsTransformAction || action instanceof CloneEntityAsTransformAction);
  }

  onSummonWatch(action) {}
    // override me in sub classes to implement special behavior

  getIsCardRelevantToWatcher(card) {
    return true;
  }
}
ModifierSummonWatchAnyPlayer.initClass(); // override me in sub classes to implement special behavior

module.exports = ModifierSummonWatchAnyPlayer;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}