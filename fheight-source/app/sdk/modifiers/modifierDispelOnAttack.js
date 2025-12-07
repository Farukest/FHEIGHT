/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierSilence = require('./modifierSilence');
const i18next = require('i18next');

/*
This is purposely not a subclass of myAttackWatch, because this dispel should occur
on beforeAction, rather than onAction
*/

class ModifierDispelOnAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDispelOnAttack";
    this.type ="ModifierDispelOnAttack";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  onBeforeAction(actionEvent) {
    super.onBeforeAction(actionEvent);
    // dispel target before attack action so that it cannot do onAttack actions
    // example: this dispel disables strikeback before it can counter attack
    const a = actionEvent.action;
    if (a instanceof AttackAction && (a.getSource() === this.getCard())) {
      return this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), a.getTarget());
    }
  }
}
ModifierDispelOnAttack.initClass();

module.exports = ModifierDispelOnAttack;
