/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch');
const HealAction = require('app/sdk/actions/healAction');

class ModifierMyGeneralDamagedWatchHealSelf extends ModifierMyGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatchHealSelf";
    this.type ="ModifierMyGeneralDamagedWatchHealSelf";
  
    this.modifierName ="My General Damage Watch Heal Self";
    this.description ="Whenever your General takes damage, %X";
  
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyGeneralDamagedWatch", "FX.Modifiers.ModifierGenericHeal"];
  }

  static createContextObject(healAmount, options) {
    if (healAmount == null) { healAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject.healAmount > 0) {
      return this.description.replace(/%X/, "restore "+modifierContextObject.healAmount+" Health to this minion");
    } else {
      return this.description.replace(/%X/, "fully heal this minion");
    }
  }

  onDamageDealtToGeneral(action) {
    if (this.getCard().getHP() < this.getCard().getMaxHP()) {
      const healAction = this.getCard().getGameSession().createActionForType(HealAction.type);
      healAction.setTarget(this.getCard());
      if (this.healAmount === 0) { // default, heal to full
        healAction.setHealAmount(this.getCard().getMaxHP() - this.getCard().getHP());
      } else {
        healAction.setHealAmount(this.healAmount);
      }
      return this.getCard().getGameSession().executeAction(healAction);
    }
  }
}
ModifierMyGeneralDamagedWatchHealSelf.initClass();

module.exports = ModifierMyGeneralDamagedWatchHealSelf;
