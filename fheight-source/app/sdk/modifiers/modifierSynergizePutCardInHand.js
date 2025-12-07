/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSynergizePutCardInHand extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizePutCardInHand";
    this.type ="ModifierSynergizePutCardInHand";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize"];
  
    this.prototype.cardDataOrIndexToPutInHand = null;
  }

  static createContextObject(cardDataOrIndexToPutInHand, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToPutInHand = cardDataOrIndexToPutInHand;
    return contextObject;
  }

  onSynergize(action) {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToPutInHand);
    return this.getGameSession().executeAction(a);
  }
}
ModifierSynergizePutCardInHand.initClass();

module.exports = ModifierSynergizePutCardInHand;
