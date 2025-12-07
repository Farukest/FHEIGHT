/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const ModifierCannot = require('./modifierCannot');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierCannotDamageGenerals extends ModifierCannot {
  static initClass() {
  
    this.prototype.type ="ModifierCannotDamageGenerals";
    this.type ="ModifierCannotDamageGenerals";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
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
    return a instanceof DamageAction && a.getTarget().getIsGeneral() && (a.getSource() === this.getCard());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.setDamageMultiplier(0);
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
ModifierCannotDamageGenerals.initClass();

module.exports = ModifierCannotDamageGenerals;
