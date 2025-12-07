/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =           require('./modifier');
const PlayCardAction =           require('app/sdk/actions/playCardAction');
const ApplyModifierAction =           require('app/sdk/actions/applyModifierAction');

const i18next = require('i18next');

class ModifierOpeningGambit extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambit";
    this.type ="ModifierOpeningGambit";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.opening_gambit_def");
  
    this.modifierName =i18next.t("modifiers.opening_gambit_name");
    this.description =null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.triggered = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onActivate() {
    super.onActivate();

    if (!this.triggered && this.getCard().getIsPlayed()) {
      // always flag self as triggered when card becomes played
      this.triggered = true;
      let executingAction = this.getGameSession().getExecutingAction();

      // account for modifier activated by being applied
      if ((executingAction != null) && executingAction instanceof ApplyModifierAction) {
        const parentAction = executingAction.getParentAction();
        if (parentAction instanceof PlayCardAction) { executingAction = parentAction; }
      }

      if ((executingAction == null) || (executingAction instanceof PlayCardAction && (executingAction.getCard() === this.getCard()))) {
        // only trigger when played PlayCardAction or no action (i.e. during game setup)
        this.getGameSession().p_startBufferingEvents();
        return this.onOpeningGambit();
      }
    }
  }

  onOpeningGambit() {}
    // override me in sub classes to implement special behavior

  getIsActiveForCache() {
    return !this.triggered && super.getIsActiveForCache();
  }
}
ModifierOpeningGambit.initClass();

module.exports = ModifierOpeningGambit;
