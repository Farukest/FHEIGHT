/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const PlayerModifierMechazorSummoned = require('./playerModifierMechazorSummoned');
const ModifierCounterMechazorBuildProgress = require('app/sdk/modifiers/modifierCounterMechazorBuildProgress');

const i18next = require('i18next');

class PlayerModifierMechazorBuildProgress extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierMechazorBuildProgress";
    this.type ="PlayerModifierMechazorBuildProgress";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.mechaz0r_def");
  
    this.modifierName =i18next.t("modifiers.mechaz0r_name");
    //@description: "Progresses MECHAZ0R build by +%X%"
  
    this.isHiddenToUI = true;
  
    this.prototype.progressContribution = 0;
     // amount that this tracker contributes to the mechaz0r build, 1 = 20%, 2 = 40%, etc
  }

  static createContextObject(progressContribution, options) {
    if (progressContribution == null) { progressContribution = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.progressContribution = progressContribution;
    return contextObject;
  }

  onApplyToCardBeforeSyncState() {
    // apply a mechaz0r counter to the General when first mechaz0r progress is added
    // once a counter is there, don't need to keep adding - original counter will update on further modifier additions
    if (!this.getCard().hasActiveModifierClass(ModifierCounterMechazorBuildProgress)) {
      return this.getGameSession().applyModifierContextObject(ModifierCounterMechazorBuildProgress.createContextObject("PlayerModifierMechazorBuildProgress","PlayerModifierMechazorSummoned"), this.getCard());
    }
  }

  static followupConditionIsMechazorComplete(cardWithFollowup, followupCard) {

    // can we build him?

    //get how far progress is
    let mechazorProgress = 0;
    for (var modifier of Array.from(cardWithFollowup.getOwner().getPlayerModifiersByClass(PlayerModifierMechazorBuildProgress))) {
      mechazorProgress += modifier.getProgressContribution();
    }

    // check how many times mechaz0r has already been built
    const numMechazorsSummoned = cardWithFollowup.getOwner().getPlayerModifiersByClass(PlayerModifierMechazorSummoned).length;

    return (mechazorProgress - (numMechazorsSummoned * 5)) >= 5;
  }

  getProgressContribution() {
    return this.progressContribution;
  }

  getStackType() {
    // progress contributions should stack only with same contributions
    return super.getStackType() + "_progress" + this.getProgressContribution();
  }
}
PlayerModifierMechazorBuildProgress.initClass();

module.exports = PlayerModifierMechazorBuildProgress;
