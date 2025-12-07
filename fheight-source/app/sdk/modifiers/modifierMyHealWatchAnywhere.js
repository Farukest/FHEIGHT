/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');
const HealAction = require('app/sdk/actions/healAction');

class ModifierMyHealWatchAnywhere extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMyHealWatchAnywhere";
    this.type ="ModifierMyHealWatchAnywhere";
  
    this.modifierName ="MyHealWatchAnywhere";
    this.description = "MyHealWatchAnywhere";
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyHealWatchAnywhere"];
  }

  // "heal watchers" are not allowed to proc if they die during the step
  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    if (this.getIsActionRelevant(action)) {
      return this.onHealWatch(action);
    }
  }

  onHealWatch(action) {}
    // override me in sub classes to implement special behavior

  getIsActionRelevant(action) {
    // watch for my action healing something (actually having HP increased by the heal, not just target of a healAction)
    if (action instanceof HealAction && (action.getOwnerId() === this.getCard().getOwnerId()) && (action.getTotalHealApplied() > 0)) {
      return true;
    } else {
      return false;
    }
  }

  onActivate() {
    // special check on activation in case this card is created mid-game
    // need to check all actions that occured this gamesession for triggers
    const healActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    return Array.from(healActions).map((action) =>
      this.onHealWatch(action));
  }
}
ModifierMyHealWatchAnywhere.initClass();


module.exports = ModifierMyHealWatchAnywhere;
