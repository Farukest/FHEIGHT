/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatch = require('./modifierOverwatch');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const UtilsPosition = require('app/common/utils/utils_position');
const CardType = require('app/sdk/cards/cardType');

class ModifierOverwatchSpellTarget extends ModifierOverwatch {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchSpellTarget";
    this.type ="ModifierOverwatchSpellTarget";
  
    this.description = "When this is the target of an enemy spell, %X";
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return super.getDescription();
    }
  }

  getIsActionRelevant(action) {
    if ((this.getCard() != null) && (action.getOwner() === this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId())) && action instanceof ApplyCardToBoardAction && action.getIsValid() && UtilsPosition.getPositionsAreEqual(this.getCard().getPosition(), action.getTargetPosition())) { // may be trying to target this unit
      const card = action.getCard();
      // is this in fact an enemy spell directly trying to target this unit? (not this space, not multiple spaces - directly targeting this unit)
      if ((card != null) && (__guard__(card.getRootCard(), x => x.type) === CardType.Spell) && !card.getTargetsSpace() && !card.getAppliesSameEffectToMultipleTargets()) {
        return true;
      }
    }
    return false;
  }
}
ModifierOverwatchSpellTarget.initClass();

module.exports = ModifierOverwatchSpellTarget;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}