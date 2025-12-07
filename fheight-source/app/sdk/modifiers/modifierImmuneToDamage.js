/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Logger = require('app/common/logger');
const ModifierImmune = require('./modifierImmune');
const DamageAction = require('app/sdk/actions/damageAction');

/*
  Modifier that reduces all damage dealt to this unit to 0.
*/

class ModifierImmuneToDamage extends ModifierImmune {
  static initClass() {
  
    this.prototype.type = "ModifierImmuneToDamage";
    this.type = "ModifierImmuneToDamage";
  
    this.modifierName = "Damage Immunity";
    this.description = "Takes no damage";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAntiMagicField"];
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
    return (this.getCard() != null) && a instanceof DamageAction && (this.getCard() === a.getTarget());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.setDamageMultiplier(0);
  }

  onModifyActionForExecution(event) {
    const a = event.action;
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
ModifierImmuneToDamage.initClass();

module.exports = ModifierImmuneToDamage;
