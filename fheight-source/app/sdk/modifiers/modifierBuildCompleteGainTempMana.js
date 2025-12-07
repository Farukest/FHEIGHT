/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBuilding = require('./modifierBuilding');
const BonusManaAction = require('app/sdk/actions/bonusManaAction');

class ModifierBuildCompleteGainTempMana extends ModifierBuilding {
  static initClass() {
  
    this.prototype.type ="ModifierBuildCompleteGainTempMana";
    this.type ="ModifierBuildCompleteGainTempMana";
  
    this.prototype.bonusMana = 0;
  }

  static createContextObject(bonusMana, description, transformCardData, turnsToBuild, options) {
    const contextObject = super.createContextObject(description, transformCardData, turnsToBuild, options);
    contextObject.bonusMana = bonusMana;
    return contextObject;
  }

  onBuildComplete() {
    super.onBuildComplete();

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const action = this.getGameSession().createActionForType(BonusManaAction.type);
    action.setSource(this.getCard());
    action.setTarget(general);
    action.bonusMana = this.bonusMana;
    action.bonusDuration = 1;
    return this.getGameSession().executeAction(action);
  }
}
ModifierBuildCompleteGainTempMana.initClass();

module.exports = ModifierBuildCompleteGainTempMana;
