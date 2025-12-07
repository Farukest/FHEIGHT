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
const ApplyModifierAction = require('app/sdk/actions/applyModifierAction');
const ModifierQuestStatusMagmar = require('./modifierQuestStatusMagmar');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierFateMagmarBuffQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateMagmarBuffQuest";
    this.type ="ModifierFateMagmarBuffQuest";
  
    this.prototype.attackBuffCount = 1;
  }

  static createContextObject(attackBuffCount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.attackBuffCount = attackBuffCount;
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.buffSpellActionIndices = null;
    return p;
  }

  getNumBuffSpells() {
    if ((this._private.buffSpellActionIndices == null)) {
      this._private.buffSpellActionIndices = [];
      this.checkFate(this.getGameSession().filterActions(this.getIsActionRelevant.bind(this)));
    }
    return this._private.buffSpellActionIndices;
  }

  updateFateCondition(action) {
    if (action != null) {
      if (this.getIsActionRelevant(action)) {
        if (!_.contains(this.getNumBuffSpells(), action.getRootAction().getIndex())) {
          this.getNumBuffSpells().push(action.getRootAction().getIndex());
          if (this.getNumBuffSpells().length < this.attackBuffCount) {
            this.removeQuestStatusModifier();
            this.applyQuestStatusModifier(false);
          }
        }
      }
    }

    if (this.getNumBuffSpells().length >= this.attackBuffCount) {
      this._private.fateFulfilled = true;
      super.updateFateCondition(); // unlock the card
      this.removeQuestStatusModifier();
      return this.applyQuestStatusModifier(true);
    }
  }

  getIsActionRelevant(action) {
    if (action.getOwnerId() === this.getOwnerId()) {
      if ((action.getRootAction() instanceof PlayCardFromHandAction || action.getRootAction() instanceof PlaySignatureCardAction) && (__guard__(action.getRootAction().getCard(), x => x.type) === CardType.Spell)) {
        if (action instanceof ApplyModifierAction && action.getModifier().getBuffsAttribute("atk") && !__guardMethod__(action.getTarget(), 'getIsGeneral', o => o.getIsGeneral())) {
          const modifier = action.getModifier();
          if (modifier.getBuffsAttribute("atk") && (modifier.attributeBuffs["atk"] > 0) && !modifier.getRebasesAttribute("atk") && !modifier.getBuffsAttributeAbsolutely("atk")) {
            if (__guard__(action.getTarget().getAppliedToBoardByAction(), x1 => x1.getRootAction()) !== action.getRootAction()) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  onActivate() {
    super.onActivate();
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (!general.hasActiveModifierClass(ModifierQuestStatusMagmar)) {
      return this.applyQuestStatusModifier(false);
    }
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusMagmar)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusMagmar)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusMagmar.createContextObject(questCompleted, this.getNumBuffSpells().length);
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateMagmarBuffQuest.initClass();

module.exports = ModifierFateMagmarBuffQuest;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}