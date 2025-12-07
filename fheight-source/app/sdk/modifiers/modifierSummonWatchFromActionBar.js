/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');

class ModifierSummonWatchFromActionBar extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchFromActionBar";
    this.type ="ModifierSummonWatchFromActionBar";
  
    this.description ="Whenever you summon a minion from your action bar, do something";
  }

  getIsActionRelevant(action) {
    return action instanceof PlayCardFromHandAction && (action.getCard() !== this.getCard()) && super.getIsActionRelevant(action);
  }
}
ModifierSummonWatchFromActionBar.initClass();
    // watch for a unit being summoned from action bar by the player who owns this entity, don't trigger on summon of this unit

module.exports = ModifierSummonWatchFromActionBar;