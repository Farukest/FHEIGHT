/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanded = require('./modifierBanded');
const ModifierFlying = require('./modifierFlying');

class ModifierBandedFlying extends ModifierFlying {
  static initClass() {
  
    this.prototype.type = "ModifierBandedFlying";
    this.type = "ModifierBandedFlying";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZealed"];
  }
}
ModifierBandedFlying.initClass();

module.exports = ModifierBandedFlying;
