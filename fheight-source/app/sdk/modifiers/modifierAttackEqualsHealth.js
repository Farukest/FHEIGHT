/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierAttackEqualsHealth extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAttackEqualsHealth";
    this.type ="ModifierAttackEqualsHealth";
  
    this.prototype.name =i18next.t("modifiers.attack_equals_health_name");
    this.prototype.description =i18next.t("modifiers.attack_equals_health_def");
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAttackEqualsHealth"];
  }

  constructor(gameSession) {
    super(gameSession);
    this.attributeBuffsAbsolute = ["atk"];
    this.attributeBuffsFixed = ["atk"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedHP = 0;

    return p;
  }

  getBuffedAttribute(attributeValue, buffKey) {
    if (buffKey === "atk") {
      return this._private.cachedHP;
    } else {
      return super.getBuffedAttribute(attributeValue, buffKey);
    }
  }

  getBuffsAttributes() {
    return true;
  }

  getBuffsAttribute(buffKey) {
    return (buffKey === "atk") || super.getBuffsAttribute(buffKey);
  }

  updateCachedStateAfterActive() {
    let hp;
    super.updateCachedStateAfterActive();

    const card = this.getCard();
    if (card != null) {
      hp = Math.max(0, card.getHP());
    } else {
      hp = 0;
    }

    if (this._private.cachedHP !== hp) {
      this._private.cachedHP = hp;
      return this.getCard().flushCachedAttribute("atk");
    }
  }
}
ModifierAttackEqualsHealth.initClass();

module.exports = ModifierAttackEqualsHealth;
