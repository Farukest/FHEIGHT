/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class ModifierAnySummonWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAnySummonWatch";
    this.type ="ModifierAnySummonWatch";
  
    this.modifierName ="Any Summon Watch";
    this.description = "Any Summon Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAnySummonWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    if (this.getIsActionRelevant(action)) {
      return this.onSummonWatch(action);
    }
  }

  getIsActionRelevant(a) {
    // watch for a unit being summoned by any player (but not this card itself)
    if (a instanceof PlayCardAction) {
      const card = a.getCard();
      return (card != null) && (card.type === CardType.Unit) && (card !== this.getCard());
    }
  }

  onSummonWatch(action) {}
    // override me in sub classes to implement special behavior

  onActivate() {
    // special check on activation in case this card is created mid-game
    // need to check all actions that occured this gamesession for triggers
    const summonActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    return Array.from(summonActions).map((action) =>
      this.onSummonWatch(action));
  }
}
ModifierAnySummonWatch.initClass();

module.exports = ModifierAnySummonWatch;
