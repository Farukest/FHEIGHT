/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyModifierAction = require('app/sdk/actions/applyModifierAction');
const KillAction = require('app/sdk/actions/killAction');

class ModifierATKThresholdDie extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierATKThresholdDie";
    this.type ="ModifierATKThresholdDie";
  
    this.modifierName ="Modifier ATK Threshold Die";
    this.description = "When this unit's attack is greater than %X it dies";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBuffSelfOnReplace"];
  }

  static createContextObject(atkThreshold, options) {
    const contextObject = super.createContextObject(options);
    contextObject.atkThreshold = atkThreshold;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description.replace(/%X/, modifierContextObject.atkThreshold);
    } else {
      return this.description;
    }
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    if ((action.getTarget() === this.getCard()) && action instanceof ApplyModifierAction) {
      return this.onATKChange(action);
    }
  }

  onATKChange(e) {
    const {
      action
    } = e;

    if (this.getCard().getATK() > this.atkThreshold) {
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(this.getCard());
      return this.getGameSession().executeAction(killAction);
    }
  }
}
ModifierATKThresholdDie.initClass();

module.exports = ModifierATKThresholdDie;
