/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierUntargetable = require('./modifierUntargetable');
const DieAction = require('app/sdk/actions/dieAction');
const DamageAction = require('app/sdk/actions/damageAction');
const HealAction = require('app/sdk/actions/healAction');
const HurtingDamageAction = require('app/sdk/actions/hurtingDamageAction');
const AttackAction = require('app/sdk/actions/attackAction');
const MoveAction = require('app/sdk/actions/moveAction');
const ResignAction = require('app/sdk/actions/resignAction');

const i18next = require('i18next');

class ModifierInvulnerable extends ModifierUntargetable {
  static initClass() {
  
    this.prototype.type ="ModifierInvulnerable";
    this.type ="ModifierInvulnerable";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.invulnerable_def");
    this.modifierName = i18next.t("modifiers.invulnerable_name");
    //@keywordDefinition: i18next.t("modifiers.structure_def")
    //@modifierName:i18next.t("modifiers.structure_name")
    this.description =null;
  
    this.prototype.maxStacks = 1;
    this.prototype.isRemovable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierInvulnerable"];
  }


  onValidateAction(event) {
    super.onValidateAction(event);

    const {
      action
    } = event;

    // when this would die, invalidate the death UNLESS it is a player initiated resign
    if (action instanceof DieAction && !(action instanceof ResignAction) && (action.getTarget() === this.getCard())) {
      return this.invalidateAction(action);
    // invalidate any damage actions against this, EXCEPT from card draw fatigue damage
    } else if (action instanceof DamageAction && (action.getTarget() === this.getCard()) && !(action instanceof HurtingDamageAction)) {
      return this.invalidateAction(action);
    // invalidate any heal actions that target this
    } else if (action instanceof HealAction && (action.getTarget() === this.getCard())) {
      return this.invalidateAction(action);
    // if this somehow tries to attack or move, invalidate that action
    } else if ((action instanceof MoveAction || action instanceof AttackAction) && (action.getSource() === this.getCard())) {
      return this.invalidateAction(action);
    }
  }
}
ModifierInvulnerable.initClass();

module.exports = ModifierInvulnerable;
