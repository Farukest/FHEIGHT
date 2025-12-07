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
const DieAction = require('app/sdk/actions/dieAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const ModifierQuestStatusAbyssian = require('./modifierQuestStatusAbyssian');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierFateAbyssianDyingQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateAbyssianDyingQuest";
    this.type ="ModifierFateAbyssianDyingQuest";
  
    this.prototype.deathCountRequired = 1;
  }

  static createContextObject(deathCountRequired, options) {
    const contextObject = super.createContextObject(options);
    contextObject.deathCountRequired = deathCountRequired;
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.deathSpellActionIndices = null;
    return p;
  }

  getDeathSpellActionIndices() {
    if ((this._private.deathSpellActionIndices == null)) {
      this._private.deathSpellActionIndices = [];
      this.checkFate(this.getGameSession().filterActions(this.getIsActionRelevant.bind(this)));
    }
    return this._private.deathSpellActionIndices;
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action)) {
      if (!_.contains(this.getDeathSpellActionIndices(), action.getRootAction().getIndex())) {
        this.getDeathSpellActionIndices().push(action.getRootAction().getIndex());
      }
      if (this.getDeathSpellActionIndices().length < this.deathCountRequired) {
        this.removeQuestStatusModifier();
        this.applyQuestStatusModifier(false);
      }
    }

    if (this.getDeathSpellActionIndices().length >= this.deathCountRequired) {
      this._private.fateFulfilled = true;
      super.updateFateCondition(); // unlock the card
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  getIsActionRelevant(action) {
    if (action.getOwnerId() === this.getOwnerId()) {
      const target = action.getTarget();
      if ((target != null) && action instanceof DieAction && (target.getType() === CardType.Unit) && (target.getOwnerId() === this.getCard().getOwnerId())) {
        if ((action.getRootAction() instanceof PlayCardFromHandAction || action.getRootAction() instanceof PlaySignatureCardAction) && (__guard__(action.getRootAction().getCard(), x => x.type) === CardType.Spell)) {
          return true;
        }
      }
    }
    return false;
  }

  onActivate() {
    super.onActivate();
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (!general.hasActiveModifierClass(ModifierQuestStatusAbyssian)) {
      return this.applyQuestStatusModifier(false);
    }
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusAbyssian)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusAbyssian)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusAbyssian.createContextObject(questCompleted, this.getDeathSpellActionIndices().length);
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateAbyssianDyingQuest.initClass();

module.exports = ModifierFateAbyssianDyingQuest;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}