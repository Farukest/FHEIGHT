/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSentinel = require('./modifierSentinel');
const CardType = require('app/sdk/cards/cardType');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');
const i18next = require('i18next');

class ModifierSentinelOpponentSummon extends ModifierSentinel {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSummon";
    this.type ="ModifierSentinelOpponentSummon";
  
    this.description = i18next.t("modifiers.sentinel_summon");
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description;
    } else {
      return super.getDescription();
    }
  }

  getCanReactToAction(action) {
    return super.getCanReactToAction(action) && this.getGameSession().getCanCardBeScheduledForRemoval(this.getCard());
  }

  getIsActionRelevant(action) {
    // watch for a unit being summoned in any way by the opponent of player who owns this entity
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() !== this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && (action.getCard() !== this.getCard())) {
      // don't react to transforms
      if (!(action instanceof PlayCardAsTransformAction || action instanceof CloneEntityAsTransformAction)) {
        return true;
      }
    }
    return false;
  }
}
ModifierSentinelOpponentSummon.initClass();

module.exports = ModifierSentinelOpponentSummon;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}