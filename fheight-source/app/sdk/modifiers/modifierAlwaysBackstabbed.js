/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierBackstab = require('./modifierBackstab');
const EVENTS = require('app/common/event_types');
const AttackAction = require('app/sdk/actions/attackAction');

class ModifierAlwaysBackstabbed extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAlwaysBackstabbed";
    this.type ="ModifierAlwaysBackstabbed";
  
    this.isHiddenToUI = false;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAlwaysBackstabbed"];
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
    return a instanceof AttackAction && (a.getTarget() === this.getCard());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.setIsStrikebackAllowed(false); // backstab attacker does not suffer strikeback
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
ModifierAlwaysBackstabbed.initClass();

module.exports = ModifierAlwaysBackstabbed;