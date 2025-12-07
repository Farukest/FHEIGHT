/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage = require('./modifierImmuneToDamage');
const CardType = require('app/sdk/cards/cardType');

class ModifierForcefieldAbsorb extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierForcefieldAbsorb";
    this.type ="ModifierForcefieldAbsorb";
  
    this.modifierName = "Forcefield Active";
    this.description = "This minion takes no damage";
  
    this.isHiddenToUI = true;
  
    this.prototype.isCloneable = false;
    this.prototype.maxStacks = 1;
  
    this.prototype.absorbedActionIndex = -1; // index of action this triggered an absorb for, when -1 no damage has been absorbed
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierForcefieldAbsorb"];
  }

  onModifyActionForExecution(event) {
    super.onModifyActionForExecution(event);

    const {
      action
    } = event;
    if (this.getIsActionRelevant(action)) {
      return this.absorbedActionIndex = action.getIndex();
    }
  }

  onAfterCleanupAction(event) {
    super.onAfterCleanupAction(event);

    // when cleaning up an action, check if this modifier absorbed damage and remove
    const {
      action
    } = event;
    if (!this.getCanAbsorb() && ((action != null ? action.getIndex() : undefined) === this.absorbedActionIndex)) {
      return this.getGameSession().removeModifier(this);
    }
  }

  getIsActionRelevant(action) {
    return this.getCanAbsorb() && super.getIsActionRelevant(action);
  }

  getCanAbsorb() {
    return this.absorbedActionIndex === -1;
  }
}
ModifierForcefieldAbsorb.initClass();

module.exports = ModifierForcefieldAbsorb;
