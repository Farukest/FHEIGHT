/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierStrikeback = require('./modifierStrikeback');
const EVENTS = require('app/common/event_types');

class ModifierExtraDamageOnCounterattack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierExtraDamageOnCounterattack";
    this.type ="ModifierExtraDamageOnCounterattack";
  
    this.modifierName ="Extra Damage on Counterattack";
    this.description ="Deals double damage on counter attacks";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch"];
  }

  static createContextObject(extraDamage,options) {
    if (extraDamage == null) { extraDamage = 2; }
    const contextObject = super.createContextObject(options);
    contextObject.extraDamage = extraDamage;
    return contextObject;
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.modify_action_for_entities_involved_in_attack) {
        return this.onModifyActionForEntitiesInvolvedInAttack(event);
      }
    }
  }

  onModifyActionForEntitiesInvolvedInAttack(actionEvent) {
    const a = actionEvent.action;
    if (this.getIsActive() && this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }

  onModifyActionForExecution(actionEvent) {
    super.onModifyActionForExecution(actionEvent);
    const a = actionEvent.action;
    if (this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }

  getIsActionRelevant(a) {
    // check if this action will deal damage or take damage
    return a.getTriggeringModifier() instanceof ModifierStrikeback && (a.getSource() === this.getCard());
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    return a.changeDamageMultiplierBy(this.extraDamage);
  }
}
ModifierExtraDamageOnCounterattack.initClass();

module.exports = ModifierExtraDamageOnCounterattack;
