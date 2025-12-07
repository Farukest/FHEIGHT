/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const ModifierSpellWatch = require('./modifierSpellWatch');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSpellWatchPutCardInHand extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchPutCardInHand";
    this.type ="ModifierSpellWatchPutCardInHand";
  
    this.modifierName ="Spell Watch (Put Card In Hand)";
    this.description = "Whenever you play a spell, put a a card in your Action Bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  static createContextObject(cardDataOrIndexToPutInHand, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    return contextObject;
  }

  onSpellWatch(action) {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierSpellWatchPutCardInHand.initClass();

module.exports = ModifierSpellWatchPutCardInHand;