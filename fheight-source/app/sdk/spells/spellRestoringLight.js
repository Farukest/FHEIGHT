/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const HealAction = require('app/sdk/actions/healAction');

class SpellRestoringLight extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.healModifier = 3;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const friendlyMinions = board.getFriendlyEntitiesForEntity(general);

    const healAction = new HealAction(this.getGameSession());
    healAction.manaCost = 0;
    healAction.setOwnerId(this.ownerId);
    healAction.setTarget(general);
    healAction.setHealAmount(this.healModifier);
    this.getGameSession().executeAction(healAction);

    return Array.from(friendlyMinions).map((entity) =>
      Array.from(this.getAppliedTargetModifiersContextObjects()).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, entity)));
  }

  setNumModifiersToApply(val) {
    return this.numModifiersToApply = val;
  }

  getNumModifiersToApply() {
    return this.numModifiersToApply;
  }

  getAppliedTargetModifiersContextObjects() {
    let appliedModifiersContextObjects = this.getTargetModifiersContextObjects();
    let numModifiersToPick = this.numModifiersToApply;
    if ((numModifiersToPick > 0) && (numModifiersToPick < appliedModifiersContextObjects.length)) {
      // pick modifiers at random
      const modifierContextObjectsToPickFrom = appliedModifiersContextObjects.slice(0);
      appliedModifiersContextObjects = [];
      while (numModifiersToPick > 0) {
        // pick a modifier and remove it from the list to avoid picking duplicates
        var modifierContextObject = modifierContextObjectsToPickFrom.splice(this.getGameSession().getRandomIntegerForExecution(modifierContextObjectsToPickFrom.length), 1)[0];
        appliedModifiersContextObjects.push(modifierContextObject);
        numModifiersToPick--;
      }
    }

    return appliedModifiersContextObjects;
  }
}
SpellRestoringLight.initClass();

module.exports = SpellRestoringLight;
