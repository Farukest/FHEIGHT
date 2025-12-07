/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierGrowPermanent = require('./modifierGrowPermanent');

const i18next = require('i18next');

class ModifierPrimalTile extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierPrimalTile";
    this.type = "ModifierPrimalTile";
  
    this.modifierName = i18next.t("modifiers.primal_flourish_name");
    this.keywordDefinition = i18next.t("modifiers.primal_flourish_def");
    this.description = i18next.t("modifiers.primal_flourish_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierPrimalTile"];
  }

  static getDescription() {
    return this.description;
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    const modifiersContextObjects = [ModifierGrowPermanent.createContextObject(2)];
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
ModifierPrimalTile.initClass();

module.exports = ModifierPrimalTile;
