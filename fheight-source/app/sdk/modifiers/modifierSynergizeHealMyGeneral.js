/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const HealAction = require('app/sdk/actions/healAction');

class ModifierSynergizeHealMyGeneral extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeHealMyGeneral";
    this.type ="ModifierSynergizeHealMyGeneral";
  
    this.description ="Restore %X Health to your General";
  
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  static createContextObject(healAmount, options) {
    const contextObject = super.createContextObject();
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.healAmount);
    } else {
      return this.description;
    }
  }

  onSynergize(action) {
    super.onSynergize(action);

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()));
    healAction.setHealAmount(this.healAmount);

    return this.getGameSession().executeAction(healAction);
  }
}
ModifierSynergizeHealMyGeneral.initClass();

module.exports = ModifierSynergizeHealMyGeneral;
