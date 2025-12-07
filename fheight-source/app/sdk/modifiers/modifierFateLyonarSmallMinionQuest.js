/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierFate = require('./modifierFate');
const CardType = require('app/sdk/cards/cardType');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');
const ModifierQuestStatusLyonar = require('./modifierQuestStatusLyonar');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierFateLyonarSmallMinionQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateLyonarSmallMinionQuest";
    this.type ="ModifierFateLyonarSmallMinionQuest";
  
    this.prototype.numMinionsRequired = 1;
  }

  static createContextObject(numMinionsRequired, options) {
    const contextObject = super.createContextObject(options);
    contextObject.numMinionsRequired = numMinionsRequired;
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.minionsSummonIds = null;
    return p;
  }

  getMinionsSummonedIds() {
    if ((this._private.minionsSummonIds == null)) {
      this._private.minionsSummonIds = [];
      this.checkFate(this.getGameSession().filterActions(this.getIsActionRelevant.bind(this)));
    }
    return this._private.minionsSummonIds;
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action)) {
      if (!_.contains(this.getMinionsSummonedIds(), action.getTarget().getIndex())) {
        this.getMinionsSummonedIds().push(action.getTarget().getIndex());
      }
      if (this.getMinionsSummonedIds().length < this.numMinionsRequired) {
        this.removeQuestStatusModifier();
        this.applyQuestStatusModifier(false);
      }
    }

    if (this.getMinionsSummonedIds().length >= this.numMinionsRequired) {
      this._private.fateFulfilled = true;
      super.updateFateCondition(); // unlock the card
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  getIsActionRelevant(action) {
    if (action.getOwnerId() === this.getOwnerId()) {
      const target = action.getTarget();
      if ((target != null) && action instanceof ApplyCardToBoardAction && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && !(action instanceof PlayCardAsTransformAction || action instanceof CloneEntityAsTransformAction)) {
        if (target.getBaseATK() <= 1) {
          return true;
        }
      }
    }
    return false;
  }

  onActivate() {
    super.onActivate();
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (!general.hasActiveModifierClass(ModifierQuestStatusLyonar)) {
      return this.applyQuestStatusModifier(false);
    }
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusLyonar)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusLyonar)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusLyonar.createContextObject(questCompleted, this.getMinionsSummonedIds().length);
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateLyonarSmallMinionQuest.initClass();

module.exports = ModifierFateLyonarSmallMinionQuest;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}