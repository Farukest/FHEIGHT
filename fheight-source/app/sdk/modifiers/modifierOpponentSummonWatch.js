/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');

class ModifierOpponentSummonWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatch";
    this.type ="ModifierOpponentSummonWatch";
  
    this.modifierName ="Opponent Summon Watch";
    this.description = "Opponent Summon Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentSummonWatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;

    // watch for a unit being summoned in any way by the opponent of player who owns this entity
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() !== this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && (action.getCard() !== this.getCard())) {
      // don't react to transforms
      if (!(action instanceof PlayCardAsTransformAction || action instanceof CloneEntityAsTransformAction)) {
        return this.onSummonWatch(action);
      }
    }
  }

  onSummonWatch(action) {}
}
ModifierOpponentSummonWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierOpponentSummonWatch;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}