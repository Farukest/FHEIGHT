/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatch = require('./modifierKillWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierKillWatchHealSelf extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchHealSelf";
    this.type ="ModifierKillWatchHealSelf";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, includeAllies, includeGenerals, options) {
    if (healAmount == null) { healAmount = 0; }
    if (includeAllies == null) { includeAllies = true; }
    if (includeGenerals == null) { includeGenerals = true; }
    const contextObject = super.createContextObject(includeAllies, includeGenerals, options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onKillWatch(action) {
    const healAction = this.getCard().getGameSession().createActionForType(HealAction.type);
    healAction.setTarget(this.getCard());
    healAction.setHealAmount(this.healAmount);
    return this.getCard().getGameSession().executeAction(healAction);
  }
}
ModifierKillWatchHealSelf.initClass();

module.exports = ModifierKillWatchHealSelf;
