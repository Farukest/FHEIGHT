/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierStunnedVanar = require('./modifierStunnedVanar');

class ModifierStunWhenAttacked extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierStunWhenAttacked";
    this.type ="ModifierStunWhenAttacked";
  
    this.modifierName ="Stunner";
    this.description ="Minions next to this minion that attack it are Stunned";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  onAction(actionEvent) {
    super.onAction(actionEvent);
    const a = actionEvent.action;
    // when this wall is directly attacked
    if (a instanceof AttackAction && (a.getTarget() === this.getCard()) && !a.getIsImplicit()) {
      // by a nearby minion
      let needle;
      if (!a.getSource().getIsGeneral() && (needle = a.getSource(), Array.from(this.getCard().getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1)).includes(needle))) {
        // stun the attacker
        return this.getGameSession().applyModifierContextObject(ModifierStunnedVanar.createContextObject(), a.getSource());
      }
    }
  }
}
ModifierStunWhenAttacked.initClass();

module.exports = ModifierStunWhenAttacked;
