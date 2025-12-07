/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');

class ModifierIntensify extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierIntensify";
    this.type ="ModifierIntensify";
  
    this.isKeyworded = true;
    this.modifierName = "Intensify";
    this.description = null;
    this.keywordDefinition = "Effect is boosted each time you play it.";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  getIsActionRelevant(action) {
    // watch for instances of playing this card
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getOwnerId()) && (action.getCard().getBaseCardId() === this.getCard().getBaseCardId())) {
      return true;
    } else {
      return false;
    }
  }

  getIntensifyAmount() {
    let amount = 0;
    const relevantActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    if (relevantActions != null) {
      amount = relevantActions.length;
    }
    return amount;
  }

  onActivate() {
    super.onActivate();
    return this.onIntensify();
  }

  onIntensify() {}
}
ModifierIntensify.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierIntensify;
