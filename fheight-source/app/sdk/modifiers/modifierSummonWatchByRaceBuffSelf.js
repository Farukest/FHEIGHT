/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const Modifier = require('./modifier');

class ModifierSummonWatchByRaceBuffSelf extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchByRaceBuffSelf";
    this.type ="ModifierSummonWatchByRaceBuffSelf";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff, targetRaceId, buffAppliedName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.targetRaceId = targetRaceId;
    contextObject.modifiersContextObjects = [Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff, {appliedName: buffAppliedName})];
    return contextObject;
  }

  onSummonWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }

  getIsCardRelevantToWatcher(card) {
    return card.getBelongsToTribe(this.targetRaceId);
  }
}
ModifierSummonWatchByRaceBuffSelf.initClass();

module.exports = ModifierSummonWatchByRaceBuffSelf;
