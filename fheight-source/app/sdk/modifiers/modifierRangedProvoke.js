/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger = require('app/common/logger');
const Modifier =   require('./modifier');
const AttackAction =   require('app/sdk/actions/attackAction');
const ModifierRangedProvoked =   require('./modifierRangedProvoked');
const ModifierRanged = require('./modifierRanged');
const _ = require('underscore');
const i18next = require('i18next');

class ModifierRangedProvoke extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierRangedProvoke";
    this.type ="ModifierRangedProvoke";
  
    this.prototype.maxStacks = 1;
  
    this.modifierName =i18next.t("modifiers.ranged_provoke_name");
    this.description =i18next.t("modifiers.ranged_provoke_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.isAura = true;
    this.prototype.auraRadius = CONFIG.WHOLE_BOARD_RADIUS;
    this.prototype.auraIncludeSelf = false;
    this.prototype.auraIncludeAlly = false;
    this.prototype.auraIncludeEnemy = true;
  
    this.prototype.modifiersContextObjects = [ModifierRangedProvoked.createContextObject()];
    this.prototype.fxResource = ["FX.Modifiers.ModifierProvoke"];
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;
    if ((this.getCard() != null) && a instanceof AttackAction && !a.getIsImplicit() && a.getIsValid() && !this.getCard().getIsSameTeamAs(a.getSource()) && _.includes(this.getEntitiesInAura(), a.getSource()) && !a.getTarget().hasModifierType(ModifierRangedProvoke.type)) {
      // in the case of attacking melee provoker, don't invalidate
      if (!(a.getSource().getIsProvoked() && _.includes(a.getTarget().getEntitiesProvoked(),a.getSource()))) {
        return this.invalidateAction(a, this.getCard().getPosition(), "Provoked - must first attack the Provoker.");
      }
    }
  }

  _filterPotentialCardInAura(card) {
    return card.hasActiveModifierClass(ModifierRanged) && super._filterPotentialCardInAura(card);
  }
}
ModifierRangedProvoke.initClass();

module.exports = ModifierRangedProvoke;
