/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatch = require('./modifierKillWatch');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction');

class ModifierKillWatchRefreshExhaustion extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchRefreshExhaustion";
    this.type ="ModifierKillWatchRefreshExhaustion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  onKillWatch(action) {
    const refreshExhaustionAction = this.getGameSession().createActionForType(RefreshExhaustionAction.type);
    refreshExhaustionAction.setSource(this.getCard());
    refreshExhaustionAction.setTarget(this.getCard());
    return this.getGameSession().executeAction(refreshExhaustionAction);
  }
}
ModifierKillWatchRefreshExhaustion.initClass();

module.exports = ModifierKillWatchRefreshExhaustion;
