/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanded = require('./modifierBanded');
const ModifierRanged = require('./modifierRanged');
const i18next = require('i18next');


class ModifierBandedRanged extends ModifierRanged {
  static initClass() {
  
    this.prototype.type = "ModifierBandedRanged";
    this.type = "ModifierBandedRanged";
  
    this.modifierName =i18next.t("modifiers.banded_ranged_name");
    this.description =i18next.t("modifiers.banded_ranged_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZealed", "FX.Modifiers.ModifierZealedRanged"];
  }
}
ModifierBandedRanged.initClass();

module.exports = ModifierBandedRanged;
