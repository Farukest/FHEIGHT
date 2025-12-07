/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction');
const ApplyExhaustionAction =  require('app/sdk/actions/applyExhaustionAction');

const i18next = require('i18next');

class ModifierFirstBlood extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierFirstBlood";
    this.type ="ModifierFirstBlood";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.rush_def");
    this.prototype.maxStacks = 1;
  
    this.modifierName =i18next.t("modifiers.rush_name");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierFirstBlood"];
  }

  onActivate()  {
    super.onActivate();
    // if rush is applied on the turn that the unit was summoned
    if (this.getGameSession().wasActionExecutedDuringTurn(this.getCard().getAppliedToBoardByAction(), this.getGameSession().getCurrentTurn()) && this.getGameSession().getCanCardBeScheduledForRemoval(this.getCard())) {
      // immediately activate the unit IF it has not already moved and / or attacked this turn (do not re-activate units that already had rush)
      if ((this.getCard().getMovesMade() === 0) && (this.getCard().getAttacksMade() === 0)) {
        const refreshExhaustionAction = this.getGameSession().createActionForType(RefreshExhaustionAction.type);
        refreshExhaustionAction.setSource(this.getCard());
        refreshExhaustionAction.setTarget(this.getCard());
        return this.getCard().getGameSession().executeAction(refreshExhaustionAction);
      }
    }
  }

  deactivateRushIfNeeded()  {
    // if rush is dispelled, deactivated, or removed on the turn that the unit was summoned
    // immediately exhaust the unit
    if (this.getGameSession().wasActionExecutedDuringTurn(__guard__(this.getCard(), x => x.getAppliedToBoardByAction()), this.getGameSession().getCurrentTurn()) && this.getGameSession().getCanCardBeScheduledForRemoval(this.getCard())) {
      const applyExhaustionAction = this.getGameSession().createActionForType(ApplyExhaustionAction.type);
      applyExhaustionAction.setSource(this.getCard());
      applyExhaustionAction.setTarget(this.getCard());
      return this.getGameSession().executeAction(applyExhaustionAction);
    }
  }

  onDeactivate() {
    super.onDeactivate();
    return this.deactivateRushIfNeeded();
  }

  onRemoveFromCard() {
    super.onRemoveFromCard();
    return this.deactivateRushIfNeeded();
  }
}
ModifierFirstBlood.initClass();


module.exports = ModifierFirstBlood;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}