/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierCannot = require('./modifierCannot');
const AttackAction = require('app/sdk/actions/attackAction');
const i18next = require('i18next');

class ModifierCannotAttackGeneral extends ModifierCannot {
  static initClass() {
  
    this.prototype.type = "ModifierCannotAttackGeneral";
    this.type = "ModifierCannotAttackGeneral";
  
    this.modifierName =i18next.t("modifiers.cannot_attack_general_name");
    this.description =i18next.t("modifiers.cannot_attack_general_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCannotAttackGeneral"];
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    // minion cannot actively attack General, but it can strike back, frenzy, etc
    if (a instanceof AttackAction && a.getIsValid() && !a.getIsImplicit() && (this.getCard() === a.getSource()) && __guard__(a.getTarget(), x => x.getIsGeneral())) {
      return this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.cannot_attack_general_error"));
    }
  }
}
ModifierCannotAttackGeneral.initClass();

module.exports = ModifierCannotAttackGeneral;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}