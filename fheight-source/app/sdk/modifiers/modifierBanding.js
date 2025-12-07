/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSituationalBuffSelf = require('./modifierSituationalBuffSelf');
const CardType = require('app/sdk/cards/cardType');

const i18next = require('i18next');

class ModifierBanding extends ModifierSituationalBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierBanding";
    this.type ="ModifierBanding";
  
    this.isKeyworded = true;
  
    this.modifierName =i18next.t("modifiers.zeal_name");
    this.keywordDefinition =i18next.t("modifiers.zeal_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal"];
  }

  getIsSituationActiveForCache() {
    // banding aura is active when this entity is near its general
    const entityPosition = this.getCard().getPosition();
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general != null) {
      const generalPosition = general.getPosition();
      return (Math.abs(entityPosition.x - generalPosition.x) <= 1) && (Math.abs(entityPosition.y - generalPosition.y) <= 1);
    }

    return false;
  }
}
ModifierBanding.initClass();

module.exports = ModifierBanding;
