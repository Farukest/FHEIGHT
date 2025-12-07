/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');

class ModifierBeforeMyAttackWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBeforeMyAttackWatch";
    this.type ="ModifierBeforeMyAttackWatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onBeforeAction(event) {
    const a = event.action;
    if (a instanceof AttackAction && (a.getSource() === this.getCard())) {
      return this.onBeforeMyAttackWatch(a);
    }
  }

  onBeforeMyAttackWatch(action) {}
}
ModifierBeforeMyAttackWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierBeforeMyAttackWatch;
