/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierDealDamageWatchDrawCard extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchDrawCard";
    this.type ="ModifierDealDamageWatchDrawCard";
  
    this.modifierName ="Deal Damage and draw card";
    this.description ="Whenever this minion deals damage, draw a card";
  }

  onDealDamage(action) {
    const a = new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId());
    return this.getGameSession().executeAction(a);
  }
}
ModifierDealDamageWatchDrawCard.initClass();

module.exports = ModifierDealDamageWatchDrawCard;
