/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const ModifierImmune = require('./modifierImmune');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const UtilsPosition = require('app/common/utils/utils_position');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

class ModifierImmuneToSpells extends ModifierImmune {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToSpells";
    this.type ="ModifierImmuneToSpells";
  
    this.modifierName =i18next.t("modifiers.immune_to_spells_name");
    this.description =i18next.t("modifiers.immune_to_spells_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierImmunity", "FX.Modifiers.ModifierImmunitySpell"];
  }

  onValidateAction(event) {
    const a = event.action;

    if ((this.getCard() != null) && a instanceof ApplyCardToBoardAction && a.getIsValid() && UtilsPosition.getPositionsAreEqual(this.getCard().getPosition(), a.getTargetPosition())) {
      const card = a.getCard();
      if ((card != null) && (__guard__(card.getRootCard(), x => x.type) === CardType.Spell) && !card.getTargetsSpace() && !card.getAppliesSameEffectToMultipleTargets()) {
        return this.invalidateAction(a, this.getCard().getPosition(), "[Not] a valid target.");
      }
    }
  }
}
ModifierImmuneToSpells.initClass();

module.exports = ModifierImmuneToSpells;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}