/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');
const HealAction = require('app/sdk/actions/healAction');

class ModifierAnyMinionHealWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAnyMinionHealWatch";
    this.type ="ModifierAnyMinionHealWatch";
  
    this.modifierName ="Any minion HealWatch";
    this.description = "";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierHealWatch"];
  }

  // "heal watchers" are not allowed to proc if they die during the step
  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    // watch for any minion being healed
    const target = action.getTarget();
    if (action instanceof HealAction && !target.getIsGeneral() && (action.getTotalHealApplied() > 0)) {
      return this.onHealWatch(action);
    }
  }

  onHealWatch(action) {}
}
ModifierAnyMinionHealWatch.initClass();
    // override me in sub classes to implement special behavior


module.exports = ModifierAnyMinionHealWatch;
