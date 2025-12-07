/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierBanded extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierBanded";
    this.type = "ModifierBanded";
  
    this.modifierName =i18next.t("modifiers.banded_name");
    this.description =i18next.t("modifiers.banded_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZealed"];
  }

  static createContextObject(attack, maxHP, options) {
    if (attack == null) { attack = 0; }
    if (maxHP == null) { maxHP = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.attributeBuffs = Modifier.createAttributeBuffsObject(attack, maxHP);
    return contextObject;
  }
}
ModifierBanded.initClass();

module.exports = ModifierBanded;
