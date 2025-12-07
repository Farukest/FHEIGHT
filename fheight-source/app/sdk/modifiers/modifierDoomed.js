/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const KillAction = require('app/sdk/actions/killAction');
const i18next = require('i18next');

class ModifierDoomed extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierDoomed";
    this.type = "ModifierDoomed";
  
    this.modifierName =i18next.t("modifiers.doomed_name");
    this.description =i18next.t("modifiers.doomed_1_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDoomed"];
  
    this.prototype.isRemovable = false;
    this.prototype.maxStacks = 1;
  }

  onTurnWatch() {
    super.onTurnWatch();

    if (this.numEndTurnsElapsed > 1) { // don't kill self on same end turn this modifier was applied!
      const entityToKill = this.getCard();
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()));
      killAction.setTarget(entityToKill);
      this.getGameSession().executeAction(killAction);
      return this.getGameSession().removeModifier(this);
    }
  }
}
ModifierDoomed.initClass();

module.exports = ModifierDoomed;
