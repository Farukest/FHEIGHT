/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambitApplyModifiers = require('./modifierOpeningGambitApplyModifiers');
const CardType = require('app/sdk/cards/cardType');

class ModifierOpeningGambitApplyModifiersByRaceId extends ModifierOpeningGambitApplyModifiers {
  static initClass() {
  
    /*
    This modifier is used to apply modifiers RANDOMLY to X entities around an entity on spawn.
    examples:
    2 random nearby friendly minions gain +1/+1
    1 random friendly minion gains provoke
    */
  
    this.prototype.type ="ModifierOpeningGambitApplyModifiersByRaceId";
    this.type ="ModifierOpeningGambitApplyModifiersByRaceId";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, managedByCard, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, raceId, description, options) {
    const contextObject = super.createContextObject(modifiersContextObjects, managedByCard, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, description, options);
    contextObject.raceId = raceId;
    return contextObject;
  }

  getAffectedEntities(action) {
    const affectedEntities = [];
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const potentialAffectedEntities = super.getAffectedEntities(action);
      for (var entity of Array.from(potentialAffectedEntities)) {
        if (entity.getBelongsToTribe(this.raceId)) {
          affectedEntities.push(entity);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierOpeningGambitApplyModifiersByRaceId.initClass();

module.exports = ModifierOpeningGambitApplyModifiersByRaceId;
