/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSentinel = require('./modifierSentinel');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const BonusManaAction =   require('app/sdk/actions/bonusManaAction');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const i18next = require('i18next');

class ModifierSentinelOpponentSpellCastRefundManaDrawCard extends ModifierSentinel {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSpellCastRefundManaDrawCard";
    this.type ="ModifierSentinelOpponentSpellCastRefundManaDrawCard";
  
    this.description = i18next.t("modifiers.sentinel_spell_cast");
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description;
    } else {
      return super.getDescription();
    }
  }

  getIsActionRelevant(action) {
    if ((action.getOwner() === this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId())) && action instanceof ApplyCardToBoardAction && action.getIsValid()) {
      const card = action.getCard();
      // watch for a spell being cast, but ignore followups! (like opening gambits)
      if ((card != null) && (__guard__(card.getRootCard(), x => x.type) === CardType.Spell)) {
        return true;
      }
    }
    return false;
  }

  onOverwatch(action) {
    super.onOverwatch(action); // transform unit
    const card = action.getCard().getRootCard();
    const enemyGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));

    if (card != null) {
      action = this.getGameSession().createActionForType(BonusManaAction.type);
      action.setTarget(enemyGeneral);
      action.bonusMana = card.getManaCost();
      action.bonusDuration = 1;
      this.getGameSession().executeAction(action);
    }

    return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId()));
  }
}
ModifierSentinelOpponentSpellCastRefundManaDrawCard.initClass();

module.exports = ModifierSentinelOpponentSpellCastRefundManaDrawCard;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}