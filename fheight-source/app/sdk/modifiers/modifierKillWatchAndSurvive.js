/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const DieAction = require('app/sdk/actions/dieAction');

class ModifierKillWatchAndSurvive extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchAndSurvive";
    this.type ="ModifierKillWatchAndSurvive";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch"];
  
    this.prototype.includeAllies = true;
    this.prototype.includeGenerals = true;
  }

  static createContextObject(includeAllies, includeGenerals, options) {
    if (includeAllies == null) { includeAllies = true; }
    if (includeGenerals == null) { includeGenerals = true; }
    const contextObject = super.createContextObject(options);
    contextObject.includeAllies = includeAllies;
    contextObject.includeGenerals = includeGenerals;
    return contextObject;
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;

    // when we kill any unit or general
    if (this.getIsActionRelevant(action)) {
      return this.onKillWatchAndSurvive(action);
    }
  }

  getIsActionRelevant(action) {
    if (action instanceof DieAction && (action.getTarget() !== this.getCard()) && (__guard__(action.getTarget(), x => x.type) === CardType.Unit) && (action.getSource() === this.getCard())) {
      if (this.includeAllies || (action.getTarget().getOwnerId() !== this.getCard().getOwnerId())) {
        if (this.includeGenerals || !action.getTarget().getIsGeneral()) {
          return true;
        }
      }
    }
    return false;
  }

  onKillWatchAndSurvive(action) {}
}
ModifierKillWatchAndSurvive.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierKillWatchAndSurvive;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}