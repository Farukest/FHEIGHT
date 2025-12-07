/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const i18next = require('i18next');

class ModifierPrimalProtection extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierPrimalProtection";
    this.type = "ModifierPrimalProtection";
  
    this.modifierName =i18next.t("modifiers.primal_protection_name");
    this.description =i18next.t("modifiers.primal_protection_def");
  
    this.isHiddenToUI = true;
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    const modifiersContextObjects = [Modifier.createContextObject()];
    modifiersContextObjects[0].description = this.description;
    modifiersContextObjects[0].modifierName = this.modifierName;
    contextObject.activeInHand = false;
    contextObject.activeInDeck = false;
    contextObject.activeInSignatureCards = false;
    contextObject.activeOnBoard = true;
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.isAura = true;
    contextObject.auraIncludeSelf = false;
    contextObject.auraIncludeAlly = true;
    contextObject.auraIncludeEnemy = false;
    contextObject.auraIncludeGeneral = false;
    contextObject.auraRadius = 0;
    return contextObject;
  }
}
ModifierPrimalProtection.initClass();

module.exports = ModifierPrimalProtection;
