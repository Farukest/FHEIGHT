/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');

class SpellApplyModifiers extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.numModifiersToApply = 0;
     // when 0 applies all targetModifiersContextObjects, when > 0 this is the number of random modifiers to apply
  }

  setNumModifiersToApply(val) {
    return this.numModifiersToApply = val;
  }

  getNumModifiersToApply() {
    return this.numModifiersToApply;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);
    if (entity != null) {
      return Array.from(this.getAppliedTargetModifiersContextObjects()).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
    }
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
SpellApplyModifiers.initClass();

module.exports = SpellApplyModifiers;
