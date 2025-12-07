/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierBackstab = require('./modifierBackstab');
const ModifierAlwaysBackstabbed = require('./modifierAlwaysBackstabbed');
const AttackAction = require('app/sdk/actions/attackAction');

class ModifierBackstabWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBackstabWatch";
    this.type ="ModifierBackstabWatch";
  
    this.modifierName ="Backstab Watch: Self";
    this.description ="Backstab Watch: Self";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  getIsActionRelevant(a) {

    const target = a.getTarget();
    const card = this.getCard();
    if ((card != null) && (target != null) && (a.getSource() === card)) {
      return target.hasActiveModifierClass(ModifierAlwaysBackstabbed) ||
        (card.hasModifierType(ModifierBackstab.type) &&
        a instanceof AttackAction &&
        this.getGameSession().getBoard().getIsPositionBehindEntity(target, card.getPosition(), 1, 0));
    }
    return false;
  }

  onAction(event) {
    super.onAction(event);
    const {
      action
    } = event;
    if (this.getIsActionRelevant(action)) {
      return this.onBackstabWatch(action);
    }
  }

  onBackstabWatch(action) {}
}
ModifierBackstabWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierBackstabWatch;
