/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierSentinelOpponentSummon = require('./modifierSentinelOpponentSummon');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSentinelOpponentSummonCopyIt extends ModifierSentinelOpponentSummon {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSummonCopyIt";
    this.type ="ModifierSentinelOpponentSummonCopyIt";
  }

  onOverwatch(action) {
    super.onOverwatch(action); // transform unit
    // damage unit that was just summoned by enemy
    if (action.getTarget() != null) {
      const costChangeModifer = ModifierManaCostChange.createContextObject(-2);
      costChangeModifer.appliedName = "Tormented Loyalty";
      const newCardData = action.getTarget().createNewCardData();
      newCardData.additionalModifiersContextObjects = [costChangeModifer];
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), newCardData);
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierSentinelOpponentSummonCopyIt.initClass();

module.exports = ModifierSentinelOpponentSummonCopyIt;
