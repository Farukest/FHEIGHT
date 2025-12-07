/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCounter = require('./modifierCounter');
const ModifierCounterBuildProgressDescription = require('./modifierCounterBuildProgressDescription');
const Modifier = require('./modifier');
const StartTurnAction = require('app/sdk/actions/startTurnAction');

const i18next = require('i18next');

/*
  Counts current build progress on the unit it is applied to and displays as a panel attached to the card
*/
class ModifierCounterBuildProgress extends ModifierCounter {
  static initClass() {
  
    this.prototype.type ="ModifierCounterBuildProgress";
    this.type ="ModifierCounterBuildProgress";
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(modTypeToTrack) {
    const contextObject = super.createContextObject();
    contextObject.modTypeToTrack = modTypeToTrack;
    return contextObject;
  }

  getModifierContextObjectToApply() {
    const modContextObject = ModifierCounterBuildProgressDescription.createContextObject(this.getCurrentCount());
    modContextObject.appliedName = i18next.t("modifiers.building_counter_applied_name");

    return modContextObject;
  }

  onAfterAction(event) {
    super.onAfterAction(event);
    const {
      action
    } = event;
    if (action instanceof StartTurnAction) {
      return this.updateCountIfNeeded();
    }
  }

  getCurrentCount() {
    const modifierBuilding = this.getGameSession().getModifierClassForType(this.modTypeToTrack);
    const buildingMod = this.getCard().getActiveModifierByClass(modifierBuilding);
    if (buildingMod != null) {
      return buildingMod.turnsRemaining;
    } else {
      return 0;
    }
  }
}
ModifierCounterBuildProgress.initClass();

module.exports = ModifierCounterBuildProgress;
