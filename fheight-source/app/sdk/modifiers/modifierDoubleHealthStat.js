/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierDoubleHealthStat extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierDoubleHealthStat";
    this.type = "ModifierDoubleHealthStat";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  
    this.description = "Doubled Health";
  }

  constructor(gameSession) {
    this.attributeBuffs = {};
    this.attributeBuffs["maxHP"] = 0;
    super(gameSession);
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();
    return this.attributeBuffs["maxHP"] = this.getCard().getHP();
  }
}
ModifierDoubleHealthStat.initClass();

module.exports = ModifierDoubleHealthStat;
