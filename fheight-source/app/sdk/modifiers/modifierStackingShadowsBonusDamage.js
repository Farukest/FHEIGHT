/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierStackingShadows = require('./modifierStackingShadows');

class ModifierStackingShadowsBonusDamage extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierStackingShadowsBonusDamage";
    this.type = "ModifierStackingShadowsBonusDamage";
  
    this.modifierName = "Shadow Creep Bonus Damage";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
    this.isHiddenToUI = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierShadowCreep"];
  }

  static createContextObject(flatBonus, multiplierBonus) {
    if (flatBonus == null) { flatBonus = 0; }
    if (multiplierBonus == null) { multiplierBonus = 1; }
    const contextObject = super.createContextObject();
    contextObject.bonusDamageAmount = flatBonus;
    contextObject.multiplierBonusDamage = multiplierBonus;
    return contextObject;
  }

  getFlatBonusDamage() {
    return this.bonusDamageAmount;
  }

  getMultiplierBonusDamage() {
    return this.multiplierBonusDamage;
  }

  onActivate() {
    super.onActivate();

    // flush cached atk attribute for this card
    return this.getCard().flushCachedAttribute("atk");
  }

  onDeactivate() {
    super.onDeactivate();

    // flush cached atk attribute for this card
    return this.getCard().flushCachedAttribute("atk");
  }
}
ModifierStackingShadowsBonusDamage.initClass();

module.exports = ModifierStackingShadowsBonusDamage;
