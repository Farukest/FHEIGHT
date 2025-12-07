/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const ModifierImmuneToSpells = require('./modifierImmuneToSpells');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const UtilsPosition = require('app/common/utils/utils_position');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

class ModifierImmuneToSpellsByEnemy extends ModifierImmuneToSpells {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToSpellsByEnemy";
    this.type ="ModifierImmuneToSpellsByEnemy";
  
    this.description =i18next.t("modifiers.immune_to_spells_by_enemy_def");
  }

  onValidateAction(event) {
    const a = event.action;

    if ((this.getCard() != null) && (a.getOwner() === this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId())) && a instanceof ApplyCardToBoardAction && a.getIsValid() && UtilsPosition.getPositionsAreEqual(this.getCard().getPosition(), a.getTargetPosition())) { // may be trying to target this unit
      const card = a.getCard();
      // is this in fact an enemy spell directly trying to target this unit? (not this space, not multiple spaces - directly targeting this unit)
      if ((card != null) && (__guard__(card.getRootCard(), x => x.type) === CardType.Spell) && !card.getTargetsSpace() && !card.getAppliesSameEffectToMultipleTargets()) {
        return this.invalidateAction(a, this.getCard().getPosition(), i18next.t("modifiers.immune_to_attacks_error"));
      }
    }
  }
}
ModifierImmuneToSpellsByEnemy.initClass();

module.exports = ModifierImmuneToSpellsByEnemy;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}