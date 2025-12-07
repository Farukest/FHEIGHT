/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const PlayerModifierOpponentSummonWatch = require('./playerModifierOpponentSummonWatch');
const SwapGeneralAction = require('app/sdk/actions/swapGeneralAction');

class PlayerModifierOpponentSummonWatchSwapGeneral extends PlayerModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierOpponentSummonWatchSwapGeneral";
    this.type ="PlayerModifierOpponentSummonWatchSwapGeneral";
  
    this.modifierName ="Opponent Summon Watch";
    this.description ="Whenever an enemy summons a minion, it becomes their new General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);

    return contextObject;
  }

  onSummonWatch(action) {
    super.onSummonWatch(action);

    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    const newMinion = action.getTarget();

    // turn the new unit into your general
    if (general != null) {
      const swapGeneralAction = new SwapGeneralAction(this.getGameSession());
      swapGeneralAction.setIsDepthFirst(false);
      swapGeneralAction.setSource(general);
      swapGeneralAction.setTarget(newMinion);
      return this.getGameSession().executeAction(swapGeneralAction);
    }
  }
}
PlayerModifierOpponentSummonWatchSwapGeneral.initClass();

module.exports = PlayerModifierOpponentSummonWatchSwapGeneral;
