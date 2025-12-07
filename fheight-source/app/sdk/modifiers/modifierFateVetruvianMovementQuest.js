/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierFate = require('./modifierFate');
const CardType = require('app/sdk/cards/cardType');
const Rarity = require('app/sdk/cards/rarityLookup');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const MoveAction = require('app/sdk/actions/moveAction');
const TeleportAction = require('app/sdk/actions/teleportAction');
const SwapGeneralAction = require('app/sdk/actions/swapGeneralAction');
const SwapUnitsAction = require('app/sdk/actions/swapUnitsAction');
const PlayerModifierEmblemSituationalVetQuestFrenzy = require('app/sdk/playerModifiers/playerModifierEmblemSituationalVetQuestFrenzy');
const ModifierQuestStatusVetruvian = require('./modifierQuestStatusVetruvian');

const i18next = require('i18next');

class ModifierFateVetruvianMovementQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateVetruvianMovementQuest";
    this.type ="ModifierFateVetruvianMovementQuest";
  }

  onActivate() {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (((general != null) && general.hasActiveModifierClass(PlayerModifierEmblemSituationalVetQuestFrenzy)) || this.questRequirementMet()) {
      this._private.fateFulfilled = true;
      this.unlockFateCard();
      if (!general.hasActiveModifierClass(ModifierQuestStatusVetruvian)) {
        return this.applyQuestStatusModifier(true);
      }
    } else {
      if (!general.hasActiveModifierClass(ModifierQuestStatusVetruvian)) {
        return this.applyQuestStatusModifier(false);
      }
    }
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action) && this.questRequirementMet()) {
      this._private.fateFulfilled = true;
      super.updateFateCondition();
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  questRequirementMet(action) {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    let columnToReach = 0;
    if (this.getCard().isOwnedByPlayer1()) {
      columnToReach = 8;
    } else {
      columnToReach = 0;
    }
    if (general.getPosition().x === columnToReach) {
      const modifiersByArtifact = general.getArtifactModifiersGroupedByArtifactCard();
      if (modifiersByArtifact.length > 0) {
        return true;
      }
    }
    return false;
  }

  getIsActionRelevant(action) {
    if (action instanceof ApplyCardToBoardAction || action instanceof MoveAction || action instanceof TeleportAction || action instanceof SwapGeneralAction || action instanceof SwapUnitsAction) {
      return true;
    }
    return false;
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusVetruvian)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusVetruvian)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusVetruvian.createContextObject();
    countModifier.appliedName = i18next.t("modifiers.vetruvianquest_counter_applied_name");
    if (questCompleted) {
      countModifier.appliedDescription = i18next.t("modifiers.quest_completed_applied_desc");
    } else {
      countModifier.appliedDescription = i18next.t("modifiers.vetruvianquest_counter_applied_desc");
    }
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateVetruvianMovementQuest.initClass();

module.exports = ModifierFateVetruvianMovementQuest;
