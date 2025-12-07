/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const ModifierCollectable =   require('./modifierCollectable');

const i18next = require('i18next');

class ModifierCollectableCard extends ModifierCollectable {
  static initClass() {
  
    this.prototype.type ="ModifierCollectableCard";
    this.type ="ModifierCollectableCard";
  
    //@modifierName: i18next.t("modifiers.bonus_mana_name")
    //@description: i18next.t("modifiers.bonus_mana_def")
  
    this.prototype.isRemovable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCollectableCard"];
  }

  static createContextObject(cardDataOrIndex, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndex = cardDataOrIndex;
    return contextObject;
  }

  onCollect(entity) {
    super.onCollect(entity);

    const a = new PutCardInHandAction(this.getGameSession(), entity.getOwnerId(), this.cardDataOrIndex);
    return this.getGameSession().executeAction(a);
  }
}
ModifierCollectableCard.initClass();

module.exports = ModifierCollectableCard;
