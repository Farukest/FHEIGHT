/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class SpellIntensify extends Spell {
  static initClass() {
  
    module.exports = SpellIntensify;
  }

  getIsActionRelevant(action) {
    // watch for instances of playing this card from hand
    if (action instanceof PlayCardAction && (action.getOwnerId() === this.getOwnerId()) && (action.getCard().getBaseCardId() === this.getBaseCardId())) {
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
}
SpellIntensify.initClass();