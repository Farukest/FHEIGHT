/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const PlayCardFromHandAction =     require('app/sdk/actions/playCardFromHandAction');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSummonWatchPutCardInHand extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchPutCardInHand";
    this.type ="ModifierSummonWatchPutCardInHand";
  
    this.modifierName ="Summon Watch (put card in hand)";
    this.description = "Whenever you summon a minion, you gain a %X in your Action bar";
  
    this.prototype.cardDataOrIndexToPutInHand = null;
  }

  static createContextObject(cardDataOrIndexToPutInHand, cardDescription,options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    contextObject.cardDescription = cardDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.cardDescription);
    } else {
      return this.description;
    }
  }

  onSummonWatch(action) {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierSummonWatchPutCardInHand.initClass();

module.exports = ModifierSummonWatchPutCardInHand;
