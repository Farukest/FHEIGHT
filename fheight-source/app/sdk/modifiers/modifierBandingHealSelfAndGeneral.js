/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =       require('app/common/config');
const ModifierBanding =   require('./modifierBanding');
const ModifierEndTurnWatchHealSelfAndGeneral =   require('./modifierEndTurnWatchHealSelfAndGeneral');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const i18next = require('i18next');

class ModifierBandingHealSelfAndGeneral extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingHealSelfAndGeneral";
    this.type ="ModifierBandingHealSelfAndGeneral";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealHeal"];
  }

  static createContextObject(healAmount, options) {
    if (healAmount == null) { healAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = i18next.t("modifiers.banding_heal_self_and_general_name");
    contextObject.healAmount = healAmount;
    const bandedContextObject = ModifierEndTurnWatchHealSelfAndGeneral.createContextObject(healAmount);
    bandedContextObject.appliedName = i18next.t("modifiers.banding_heal_self_and_general_name");
    contextObject.modifiersContextObjects = [bandedContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.healAmount);
    } else {
      return this.description;
    }
  }
}
ModifierBandingHealSelfAndGeneral.initClass();

module.exports = ModifierBandingHealSelfAndGeneral;
