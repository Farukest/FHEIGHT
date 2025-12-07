/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSituationalBuffSelf = require('./modifierSituationalBuffSelf');

class ModifierSituationalBuffSelfIfFullHealth extends ModifierSituationalBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierSituationalBuffSelfIfFullHealth";
    this.type ="ModifierSituationalBuffSelfIfFullHealth";
  
    this.modifierName ="ModifierSituationalBuffSelfIfFullHealth";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(modifierContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifierContextObjects;
    return contextObject;
  }

  getIsSituationActiveForCache() {
    if (this.getCard().getHP() === this.getCard().getMaxHP()) {
      return true;
    }
    return false;
  }
}
ModifierSituationalBuffSelfIfFullHealth.initClass();

module.exports = ModifierSituationalBuffSelfIfFullHealth;
