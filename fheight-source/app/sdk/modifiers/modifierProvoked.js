/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const MoveAction = require('app/sdk/actions/moveAction');
const AttackAction =   require('app/sdk/actions/attackAction');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierProvoked extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierProvoked";
    this.type = "ModifierProvoked";
  
    this.modifierName = i18next.t("modifiers.provoked_name");
    this.description = i18next.t("modifiers.provoked_desc");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    //attributeBuffs:
    //  speed: 0
    //attributeBuffsAbsolute: ["speed"]
    //attributeBuffsFixed: ["speed"]
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierProvoked"];
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    // rather than rooting the unit in place, we'll show the regular movement path
    // but if unit attempts to move, block the move action and display an error message
    if ((this.getCard() != null) && a instanceof MoveAction && a.getIsValid() && (this.getCard() === a.getSource())) {
      this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.provoked_move_error"));
    }

    // If a unit is provoked it must target one of its provokers
    // First check for valid explicit attack actions
    if ((this.getCard() != null) && (this.getCard() === a.getSource()) && a instanceof AttackAction && a.getIsValid() && !a.getIsImplicit() && !a.getTarget().getIsSameTeamAs(a.getSource())) {
      // In the case of attacking a ranged provoker, don't invalidate
      if (!(a.getSource().getIsRangedProvoked() && a.getTarget().getIsRangedProvoker())) {
        // Check to make sure target is a provoker
        if (!a.getTarget().getIsProvoker()) {
          this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.provoked_attack_error"));
        }

        // Then check for if target is one of the provokers provoking this unit
        if (!_.contains(a.getTarget().getEntitiesProvoked(), this.getCard())) {
          return this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.provoked_attack_error"));
        }
      }
    }
  }
}
ModifierProvoked.initClass();



module.exports = ModifierProvoked;
