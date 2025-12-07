/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBuilding = require('./modifierBuilding');
const HealAction = require('app/sdk/actions/healAction');

class ModifierBuildCompleteHealGeneral extends ModifierBuilding {
  static initClass() {
  
    this.prototype.type ="ModifierBuildCompleteHealGeneral";
    this.type ="ModifierBuildCompleteHealGeneral";
  
    this.prototype.healAmount = 0;
  }

  static createContextObject(healAmount, description, transformCardData, turnsToBuild, options) {
    const contextObject = super.createContextObject(description, transformCardData, turnsToBuild, options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onBuildComplete() {
    super.onBuildComplete();

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(this.healAmount);
    return this.getGameSession().executeAction(healAction);
  }
}
ModifierBuildCompleteHealGeneral.initClass();

module.exports = ModifierBuildCompleteHealGeneral;
