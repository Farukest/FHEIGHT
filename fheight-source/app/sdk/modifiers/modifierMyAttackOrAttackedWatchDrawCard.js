/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackOrAttackedWatch = require('./modifierMyAttackOrAttackedWatch');
const CardType = require('app/sdk/cards/cardType');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierMyAttackOrAttackedWatchDrawCard extends ModifierMyAttackOrAttackedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackOrAttackedWatchDrawCard";
    this.type ="ModifierMyAttackOrAttackedWatchDrawCard";
  
    this.modifierName ="Attack or Attacked Watch and Draw Card";
    this.description ="Whenever this minion attacks or is attacked, draw a card";
  }

  onMyAttackOrAttackedWatch(action) {
    const a = new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId());
    return this.getGameSession().executeAction(a);
  }
}
ModifierMyAttackOrAttackedWatchDrawCard.initClass();

module.exports = ModifierMyAttackOrAttackedWatchDrawCard;
