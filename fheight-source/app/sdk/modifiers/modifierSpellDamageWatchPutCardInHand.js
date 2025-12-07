/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSpellDamageWatch = require('./modifierSpellDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSpellDamageWatchPutCardInHand extends ModifierSpellDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellDamageWatchPutCardInHand";
    this.type ="ModifierSpellDamageWatchPutCardInHand";
  }

  static createContextObject(cardDataOrIndexToPutInHand, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    return contextObject;
  }

  onDamagingSpellcast(action) {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierSpellDamageWatchPutCardInHand.initClass();

module.exports = ModifierSpellDamageWatchPutCardInHand;
