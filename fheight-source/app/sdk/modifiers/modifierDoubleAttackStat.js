/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierDoubleAttackStat extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierDoubleAttackStat";
    this.type = "ModifierDoubleAttackStat";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  
    this.description = "Doubled Attack";
  }

  constructor(gameSession) {
    this.attributeBuffs = {};
    this.attributeBuffs["atk"] = 0;
    super(gameSession);
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();
    return this.attributeBuffs["atk"] = this.getCard().getATK();
  }
}
ModifierDoubleAttackStat.initClass();


module.exports = ModifierDoubleAttackStat;
