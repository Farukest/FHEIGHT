/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCounter = require('./modifierCounter');
const ModifierCounterShadowCreepDescription = require('./modifierCounterShadowCreepDescription');
const StartTurnAction = require('app/sdk/actions/startTurnAction');

const i18next = require('i18next');

/*
  Counts total number of shadow creep tiles owned by this player
*/
class ModifierCounterShadowCreep extends ModifierCounter {
  static initClass() {
  
    this.prototype.type ="ModifierCounterShadowCreep";
    this.type ="ModifierCounterShadowCreep";
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(modTypeToTrack) {
    const contextObject = super.createContextObject();
    contextObject.modTypeToTrack = modTypeToTrack;
    return contextObject;
  }

  getModifierContextObjectToApply() {
    const modContextObject = ModifierCounterShadowCreepDescription.createContextObject(this.getCurrentCount());
    modContextObject.appliedName = i18next.t("modifiers.shadowcreep_counter_applied_name");

    return modContextObject;
  }

  getCurrentCount() {
    const modifierStackingShadows = this.getGameSession().getModifierClassForType(this.modTypeToTrack);
    return modifierStackingShadows.getNumStacksForPlayer(this.getGameSession().getBoard(), this.getCard().getOwner());
  }
}
ModifierCounterShadowCreep.initClass();


module.exports = ModifierCounterShadowCreep;
