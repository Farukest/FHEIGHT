/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierBuilding = require('app/sdk/modifiers/modifierBuilding');
const ModifierOpeningGambitProgressBuild = require('app/sdk/modifiers/modifierOpeningGambitProgressBuild');

class ModifierBuildWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBuildWatch";
    this.type ="ModifierBuildWatch";
  
    this.modifierName ="Build Watch";
    this.description = "Build Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBuildWatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;

    // watch for a unit transformed by building complete
    if (this.getIsActionRelevant(action) && this.getIsCardRelevantToWatcher(action.getCard())) {
      return this.onBuildWatch(action);
    }
  }

  getIsActionRelevant(action) {
    return action instanceof PlayCardAsTransformAction && (action.getTriggeringModifier() instanceof ModifierBuilding || action.getTriggeringModifier() instanceof ModifierOpeningGambitProgressBuild);
  }

  onBuildWatch(action) {}
    // override me in sub classes to implement special behavior

  getIsCardRelevantToWatcher(card) {
    return true;
  }
}
ModifierBuildWatch.initClass(); // override me in sub classes to implement special behavior


module.exports = ModifierBuildWatch;
