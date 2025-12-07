/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const CardType = require('app/sdk/cards/cardType');

const i18next = require('i18next');

class ModifierAntiMagicField extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierAntiMagicField";
    this.type = "ModifierAntiMagicField";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.antimagic_field_def");
  
    this.modifierName = i18next.t("modifiers.antimagic_field_name");
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
    this.prototype.fxResource = ["FX.Modifiers.ModifierAntiMagicField"];
  }

  onValidateAction(event) {
    const a = event.action;

    // cannot be targeted by spells
    if ((this.getCard() != null) && a instanceof ApplyCardToBoardAction && a.getIsValid() && UtilsPosition.getPositionsAreEqual(this.getCard().getPosition(), a.getTargetPosition())) {
      const card = a.getCard();
      if ((card.getRootPlayedCard().type === CardType.Spell) && !card.getTargetsSpace() && !card.getAppliesSameEffectToMultipleTargets()) {
        return this.invalidateAction(a, this.getCard().getPosition(), "Protected by Anti-Magic Field.");
      }
    }
  }

  onModifyActionForExecution(event) {
    const a = event.action;

    // cannot be damaged by spells
    if (a instanceof DamageAction) {
      const rootAction = a.getRootAction();
      if (rootAction instanceof ApplyCardToBoardAction && (rootAction.getCard().getRootPlayedCard().type === CardType.Spell) && this.getCard() && (a.getTarget() === this.getCard())) {
        a.setChangedByModifier(this);
        return a.setDamageMultiplier(0);
      }
    }
  }
}
ModifierAntiMagicField.initClass();

module.exports = ModifierAntiMagicField;
