/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDeathWatch = require('./modifierDeathWatch');
const SwapUnitAllegianceAction =     require('app/sdk/actions/swapUnitAllegianceAction');

class ModifierDeathWatchFriendlyMinionSwapAllegiance extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchFriendlyMinionSwapAllegiance";
    this.type ="ModifierDeathWatchFriendlyMinionSwapAllegiance";
  
    this.modifierName ="Deathwatch";
    this.description ="Whenever a friendly minion is destroyed, your opponent gains control of this minion.";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericChain"];
  }

  onDeathWatch(action) {
    //if the target is a friendly minion
    if (action.getTarget().getOwnerId() === this.getCard().getOwnerId()) {
      const a = new SwapUnitAllegianceAction(this.getGameSession());
      a.setTarget(this.getCard());
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierDeathWatchFriendlyMinionSwapAllegiance.initClass();

module.exports = ModifierDeathWatchFriendlyMinionSwapAllegiance;
