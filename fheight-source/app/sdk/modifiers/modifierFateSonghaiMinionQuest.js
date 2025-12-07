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
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const ModifierQuestStatusSonghai = require('./modifierQuestStatusSonghai');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierFateSonghaiMinionQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateSonghaiMinionQuest";
    this.type ="ModifierFateSonghaiMinionQuest";
  
    this.prototype.numDifferentCostsRequired = 1;
  }

  static createContextObject(numDifferentCostsRequired, options) {
    const contextObject = super.createContextObject(options);
    contextObject.numDifferentCostsRequired = numDifferentCostsRequired;
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.minionCostsSummoned = null;
    return p;
  }

  getMinionCostsSummoned() {
    if ((this._private.minionCostsSummoned == null)) {
      this._private.minionCostsSummoned = [];
      this.checkFate(this.getGameSession().filterActions(this.getIsActionRelevant.bind(this)));
    }
    return this._private.minionCostsSummoned;
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action)) {
      const target = action.getTarget();
      if (target != null) {
        const manaCost = target.getBaseManaCost();
        let costAlreadyPlayed = false;
        for (var cost of Array.from(this.getMinionCostsSummoned())) {
          if ((manaCost != null) && (manaCost === cost)) {
            costAlreadyPlayed = true;
            break;
          }
        }
        if (!costAlreadyPlayed) {
          this.getMinionCostsSummoned().push(manaCost);
          if (this.getMinionCostsSummoned().length < this.numDifferentCostsRequired) {
            this.removeQuestStatusModifier();
            this.applyQuestStatusModifier(false);
          }
        }
      }
    }

    if (this.getMinionCostsSummoned().length >= this.numDifferentCostsRequired) {
      this._private.fateFulfilled = true;
      super.updateFateCondition(); // unlock the card
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  getIsActionRelevant(action) {
    if (action.getOwnerId() === this.getOwnerId()) {
      const target = action.getTarget();
      if (action instanceof PlayCardFromHandAction && ((target != null ? target.getType() : undefined) === CardType.Unit)) {
        return true;
      }
    }
    return false;
  }

  onActivate() {
    super.onActivate();
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (!general.hasActiveModifierClass(ModifierQuestStatusSonghai)) {
      return this.applyQuestStatusModifier(false);
    }
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusSonghai)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusSonghai)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusSonghai.createContextObject(questCompleted, this.getMinionCostsSummoned());
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }

  ascendingSort(num) {
    return num;
  }
}
ModifierFateSonghaiMinionQuest.initClass();

module.exports = ModifierFateSonghaiMinionQuest;
