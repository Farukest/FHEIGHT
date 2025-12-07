/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierSentinelOpponentSummon = require('./modifierSentinelOpponentSummon');
const SwapUnitsAction = require('app/sdk/actions/swapUnitsAction');
const FXType = require('app/sdk/helpers/fxType');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierSentinelOpponentSummonSwapPlaces extends ModifierSentinelOpponentSummon {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSummonSwapPlaces";
    this.type ="ModifierSentinelOpponentSummonSwapPlaces";
  }

  onOverwatch(action) {
    // damage unit that was just summoned by enemy
    const transformedUnit = super.onOverwatch(action); // transform unit
    if ((action.getTarget() != null) && this.getGameSession().getCanCardBeScheduledForRemoval(transformedUnit, true)) {
      const swapAction = new SwapUnitsAction(this.getGameSession());
      swapAction.setOwnerId(this.getOwnerId());
      swapAction.setSource(transformedUnit);
      swapAction.setTarget(action.getTarget());
      swapAction.setFXResource(_.union(swapAction.getFXResource(), this.getFXResource()));
      return this.getGameSession().executeAction(swapAction);
    }
  }
}
ModifierSentinelOpponentSummonSwapPlaces.initClass();

module.exports = ModifierSentinelOpponentSummonSwapPlaces;
