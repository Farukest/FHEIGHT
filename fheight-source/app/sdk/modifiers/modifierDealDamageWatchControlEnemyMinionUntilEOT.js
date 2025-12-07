/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const SwapUnitAllegianceAction = require('app/sdk/actions/swapUnitAllegianceAction.js');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction.js');
const ModifierEndTurnWatchSwapAllegiance = require('app/sdk/modifiers/modifierEndTurnWatchSwapAllegiance');

class ModifierDealDamageWatchControlEnemyMinionUntilEOT extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchControlEnemyMinionUntilEOT";
    this.type ="ModifierDealDamageWatchControlEnemyMinionUntilEOT";
  
    this.modifierName ="Deal Damage to a minion and take control of it";
    this.description ="Whenever this minion deals damage to a minion, take control of it until end of turn";
  }

  onDealDamage(action) {

    const target = action.getTarget();

    if (((target != null ? target.type : undefined) === CardType.Unit) && !target.getIsGeneral()) {

      let endTurnDuration = 1;
      if (!this.getCard().isOwnersTurn()) {
        endTurnDuration = 2;
      }

      const a = new SwapUnitAllegianceAction(this.getGameSession());
      a.setTarget(target);
      this.getGameSession().executeAction(a);

      // activate immediately
      const refreshExhaustionAction = new RefreshExhaustionAction(this.getGameSession());
      refreshExhaustionAction.setTarget(target);
      this.getGameSession().executeAction(refreshExhaustionAction);

      // give back at end of turn
      const swapAllegianceContextObject = ModifierEndTurnWatchSwapAllegiance.createContextObject();
      swapAllegianceContextObject.durationEndTurn = endTurnDuration;
      swapAllegianceContextObject.isRemovable = false;
      return this.getGameSession().applyModifierContextObject(swapAllegianceContextObject, target);
    }
  }
}
ModifierDealDamageWatchControlEnemyMinionUntilEOT.initClass();

module.exports = ModifierDealDamageWatchControlEnemyMinionUntilEOT;
