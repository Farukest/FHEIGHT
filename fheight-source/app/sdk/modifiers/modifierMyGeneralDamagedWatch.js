/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =           require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierMyGeneralDamagedWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatch";
    this.type ="ModifierMyGeneralDamagedWatch";
  
    this.modifierName ="My General Damaged Watch";
    this.description ="My General Damaged Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyGeneralDamagedWatch"];
  }

  onAfterCleanupAction(actionEvent) {
    super.onAfterCleanupAction(actionEvent);

    const {
      action
    } = actionEvent;
    // check if action is a damage action targeting my General
    if (action instanceof DamageAction) {
      const target = action.getTarget();
      if ((target != null) && target.getIsSameTeamAs(this.getCard()) && target.getWasGeneral() && this.willDealDamage(action)) {
        return this.onDamageDealtToGeneral(action);
      }
    }
  }

  willDealDamage(action) {
    // total damage should be calculated during modify_action_for_execution phase
    return action.getTotalDamageAmount() > 0;
  }

  onDamageDealtToGeneral(action) {}
}
ModifierMyGeneralDamagedWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierMyGeneralDamagedWatch;
