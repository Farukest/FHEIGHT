/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchApplyModifiers = require('./modifierSummonWatchApplyModifiers');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSummonWatchFromActionBarApplyModifiers extends ModifierSummonWatchApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchFromActionBarApplyModifiers";
    this.type ="ModifierSummonWatchFromActionBarApplyModifiers";
  
    this.description ="Minions summoned from your action bar, gain %X";
  }

  getIsActionRelevant(action) {
    return action instanceof PlayCardFromHandAction && (action.getCard() !== this.getCard()) && super.getIsActionRelevant(action);
  }
}
ModifierSummonWatchFromActionBarApplyModifiers.initClass();
    // watch for a unit being summoned from action bar by the player who owns this entity, don't trigger on summon of this unit

module.exports = ModifierSummonWatchFromActionBarApplyModifiers;
