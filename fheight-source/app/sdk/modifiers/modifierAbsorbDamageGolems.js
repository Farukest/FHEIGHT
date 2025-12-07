/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const i18next = require('i18next');

class ModifierAbsorbDamageGolems extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAbsorbDamageGolems";
    this.type ="ModifierAbsorbDamageGolems";
  
    this.modifierName =i18next.t("modifiers.absorb_damage_golems_name");
    this.description =i18next.t("modifiers.absorb_damage_golems_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.canAbsorb = true; // can absorb damage from 1 damage action per turn
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAbsorbDamageGolems"];
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
    return a instanceof DamageAction && (a.getTarget() === this.getCard());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.changeFinalDamageBy(-1);
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
ModifierAbsorbDamageGolems.initClass();

module.exports = ModifierAbsorbDamageGolems;
