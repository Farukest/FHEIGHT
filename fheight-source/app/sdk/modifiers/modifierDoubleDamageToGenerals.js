/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDoubleDamageToGenerals extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDoubleDamageToGenerals";
    this.type ="ModifierDoubleDamageToGenerals";
  
    this.modifierName ="Double Damage To Generals";
    this.description ="Deals double damage to Generals";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.damageBonus = 2;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDoubleDamageToGenerals"];
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.modify_action_for_entities_involved_in_attack) {
        return this.onModifyActionForEntitiesInvolvedInAttack(event);
      }
    }
  }

  getIsActionRelevant(a) {
    return a instanceof DamageAction && (a.getSource() === this.getCard()) && __guard__(a.getTarget(), x => x.getIsGeneral());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.changeDamageMultiplierBy(this.damageBonus);
  }

  onModifyActionForExecution(actionEvent) {
    super.onModifyActionForExecution(actionEvent);
    const a = actionEvent.action;
    if (this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }

  onModifyActionForEntitiesInvolvedInAttack(actionEvent) {
    const a = actionEvent.action;
    if (this.getIsActive() && this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }
}
ModifierDoubleDamageToGenerals.initClass();

module.exports = ModifierDoubleDamageToGenerals;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}