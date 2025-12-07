/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierDyingWishBuffEnemyGeneral extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishBuffEnemyGeneral";
    this.type ="ModifierDyingWishBuffEnemyGeneral";
  
    this.prototype.name ="ModifierDyingWishBuffEnemyGeneral";
    this.prototype.description = "When this minion dies, buff the enemy general";
  
    this.appliedName = "Agonizing Death";
    this.appliedDescription = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(atkBuff, healthBuff, options) {
    if (atkBuff == null) { atkBuff = 2; }
    if (healthBuff == null) { healthBuff = 10; }
    const contextObject = super.createContextObject(options);
    contextObject.atkBuff = atkBuff;
    contextObject.healthBuff = healthBuff;
    return contextObject;
  }

  onDyingWish() {
    const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    if (enemyGeneral != null) {
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(this.atkBuff,this.healthBuff);
      statContextObject.appliedName = i18next.t("modifiers.boss_36_applied_name");
      return this.getGameSession().applyModifierContextObject(statContextObject, enemyGeneral);
    }
  }
}
ModifierDyingWishBuffEnemyGeneral.initClass();

module.exports = ModifierDyingWishBuffEnemyGeneral;
