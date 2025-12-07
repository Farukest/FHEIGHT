/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierFate = require('./modifierFate');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const RemoveCardFromDeckAction = require('app/sdk/actions/removeCardFromDeckAction');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const PlayerModifierEmblemSummonWatchSingletonQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchSingletonQuest');
const ModifierQuestStatusNeutral = require('./modifierQuestStatusNeutral');
const Cards = require('app/sdk/cards/cardsLookupComplete');

const i18next = require('i18next');

class ModifierFateSingleton extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateSingleton";
    this.type ="ModifierFateSingleton";
  }

  onActivate() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      if (((general != null) && general.hasActiveModifierClass(PlayerModifierEmblemSummonWatchSingletonQuest)) || !this.checkDeckForDuplicates()) {
        this._private.fateFulfilled = true;
        this.unlockFateCard();
        if (!general.hasActiveModifierClass(ModifierQuestStatusNeutral)) {
          return this.applyQuestStatusModifier(true);
        }
      } else {
        if (!general.hasActiveModifierClass(ModifierQuestStatusNeutral)) {
          return this.applyQuestStatusModifier(false);
        }
      }
    }
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action) && !this.checkDeckForDuplicates()) {
      this._private.fateFulfilled = true;
      super.updateFateCondition();
      const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  checkDeckForDuplicates() {
    let hasDuplicate = false;
    const deckCards = this.getGameSession().getPlayerSetupDataForPlayerId(this.getCard().getOwnerId()).deck;
    const checkedCardIds = [];
    for (var card of Array.from(deckCards)) {
      for (var checkedId of Array.from(checkedCardIds)) {
        if (Cards.getBaseCardId(card.id) === checkedId) {
          hasDuplicate = true;
          break;
        }
      }
      if (!hasDuplicate) {
        checkedCardIds.push(Cards.getBaseCardId(card.id));
      } else {
        break;
      }
    }

    return hasDuplicate;
  }

  fateConditionFulfilled() {
    return !this.checkDeckForDuplicates();
  }

  getIsActionRelevant(action) {
    if (action.getOwnerId() === this.getOwnerId()) {
      if (action instanceof DrawCardAction || action instanceof RemoveCardFromDeckAction || action instanceof PutCardInDeckAction || action instanceof PutCardInHandAction) {
        return true;
      }
    }
    return false;
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusNeutral)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusNeutral)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusNeutral.createContextObject();
    countModifier.appliedName = i18next.t("modifiers.neutralquest_counter_applied_name");
    if (questCompleted) {
      countModifier.appliedDescription = i18next.t("modifiers.quest_completed_applied_desc");
    } else {
      countModifier.appliedDescription = i18next.t("modifiers.neutralquest_counter_applied_desc");
    }
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateSingleton.initClass();

module.exports = ModifierFateSingleton;
