/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =           require('./modifier');
const DieAction =         require('app/sdk/actions/dieAction');
const CardType =           require('app/sdk/cards/cardType');
const Stringifiers =       require('app/sdk/helpers/stringifiers');

const i18next = require('i18next');

class ModifierDeathWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatch";
    this.type ="ModifierDeathWatch";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.deathwatch_def");
  
    this.modifierName =i18next.t("modifiers.deathwatch_name");
    this.description = "Deathwatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    // watch for a unit dying
    if (this.getIsActionRelevant(action)) {
      return this.onDeathWatch(action);
    }
  }

  onDeathWatch(action) {}
    // override me in sub classes to implement special behavior

  getIsActionRelevant(action) {
    return action instanceof DieAction && (action.getTarget() != null) && (action.getTarget().getType() === CardType.Unit) && (action.getTarget() !== this.getCard());
  }
}
ModifierDeathWatch.initClass();


module.exports = ModifierDeathWatch;
